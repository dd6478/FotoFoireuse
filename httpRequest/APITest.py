import requests
from django.db.backends import base


class LoginAPI:
    def __init__(self, baseurl):
        self.base_url = baseurl
        self.accessToken = None
        self.refreshToken = None

    def login(self, username, password):
        url = f"{self.base_url}/user/login/"
        data = {
            "username": username,
            "password": password
        }
        response = requests.post(url, data=data)
        if response.status_code == 200:
            self.accessToken = response.json()['access']
            self.refreshToken = response.json()['refresh']
            return True
        else:
            print(f"status {response.status_code} and {response.json()}")
            return False

    def register(self, username, password, email, first_name, last_name, sexe):
        url = f"{self.base_url}/user/register/"
        data = {
            "username": username,
            "password": password,
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
            "sexe": sexe
        }
        response = requests.post(url, data=data)
        if response.status_code == 200:
            print(f"user is created succesfully")
            return True
        else:
            return False

    def refresh(self):
        url = f"{self.base_url}/token/refresh/"
        data = {
            "refresh": self.refreshToken
        }
        response = requests.post(url, data=data)
        if response.status_code == 200:
            self.accessToken = response.json()['access']
            return True
        else:
            return False


class FotofoireuseAPI:
    def __init__(self, baseurl):
        self.base_url = baseurl

    def addConcours(self, name, desc, startDate, endDate, tk):
        url = f"{self.base_url}/concours/"
        Authorization = f"Bearer {tk}"
        data = {
            "name": name,
            "description": desc,
            "startDate": startDate,
            "endDate": endDate
        }
        response = requests.post(url, data=data, headers={"Authorization": Authorization})
        if response.status_code == 201:
            return True
        else:
            return False

    def addPhoto(self, title, tk):
        url = f"{self.base_url}/concours/1/photos/"
        Authorization = f"Bearer {tk}"
        data = {
            "title": title,
        }
        with open("photos/cyp.png", "rb") as img_file:
            files = {
                "image": ("cyp.png", img_file, "image/png")
            }
            response = requests.post(url, data=data, files=files, headers={"Authorization": Authorization})
        if response.status_code == 201:
            return True
        else:
            print(response.content)  # print the response content if the status code is not 201
            return False


loginAPI = LoginAPI("http://localhost/api")
print(loginAPI.register("testApi", "testAPI", "test@API.fr", "name", "last", "M"))
print(loginAPI.login("testApi", "testAPI"))
token = loginAPI.accessToken
print(loginAPI.refresh())
if token != loginAPI.accessToken:
    print(True)

fotofoireuseAPI = FotofoireuseAPI("http://localhost/api")
if int(input("1: init, 2: continue")) == 1:
    print(fotofoireuseAPI.addConcours("concours1", "desc1", "2022-01-01", "2022-01-02", loginAPI.accessToken))
    print(fotofoireuseAPI.addPhoto("photo1", loginAPI.accessToken))
    print(fotofoireuseAPI.addPhoto("photo2", loginAPI.accessToken))
