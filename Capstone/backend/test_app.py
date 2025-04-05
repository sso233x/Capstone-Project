import unittest
from flask_bcrypt import Bcrypt
from app import app, db, User, GymClass, Attendance
from flask_jwt_extended import create_access_token

bcrypt = Bcrypt(app)

class GymAPITestCase(unittest.TestCase):
    
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True
        with app.app_context():
            db.create_all()
            hashed_pw = bcrypt.generate_password_hash("testpassword").decode('utf-8')
            self.admin = User(name="Admin", email="admin@example.com", password=hashed_pw, role="admin")
            self.member = User(name="Member", email="member@example.com", password=hashed_pw, role="member")
            db.session.add_all([self.admin, self.member])
            db.session.commit()
            
            self.admin_token = create_access_token(identity={"id": self.admin.id, "role": "admin"})
            self.member_token = create_access_token(identity={"id": self.member.id, "role": "member"})

    def tearDown(self):
        with app.app_context():
            db.session.remove()
            db.drop_all()

    def test_register_user(self):
        response = self.app.post('/register', json={
            "name": "Test User",
            "email": "test@example.com",
            "password": "testpassword"
        })
        self.assertEqual(response.status_code, 201)
        self.assertIn("User registered", response.json['message'])

    def test_login(self):
        response = self.app.post('/login', json={
            "email": "member@example.com",
            "password": "testpassword"
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn("token", response.json)

    def test_create_class_as_admin(self):
        response = self.app.post('/classes', headers={"Authorization": f"Bearer {self.admin_token}"}, json={
            "name": "Yoga",
            "capacity": 20,
            "schedule": "Monday 6PM"
        })
        self.assertEqual(response.status_code, 201)
        self.assertIn("Class created", response.json['message'])

    def test_create_class_as_member(self):
        response = self.app.post('/classes', headers={"Authorization": f"Bearer {self.member_token}"}, json={
            "name": "Pilates",
            "capacity": 15,
            "schedule": "Tuesday 5PM"
        })
        self.assertEqual(response.status_code, 403)
        self.assertIn("Access denied", response.json['message'])

    def test_get_classes(self):
        response = self.app.get('/classes', headers={"Authorization": f"Bearer {self.member_token}"})
        self.assertEqual(response.status_code, 200)

if __name__ == '__main__':
    unittest.main()
