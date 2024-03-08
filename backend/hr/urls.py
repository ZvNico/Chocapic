from django.urls import path

from . import views

app_name = "hr"


urlpatterns = [
    path("", views.index, name="index"),
    path("reset_db", views.reset_db, name="reset_db"),
    path("add_employee", views.add_employee, name="add_employee"),
    path("employees", views.employees, name="employees"),
    path("employee/<id>/address", views.address, name="address"),
    path("employee/<id>/basic_info", views.basic_info, name="basic_info"),
    path("employee/<id>/contract", views.contract, name="contract"),
    path("employee/<id>", views.employee, name="employee"),
    path("employee/delete/<id>", views.delete_employee, name="delete_employee"),
    path("employee/<id>/promote", views.promote, name="promote"),
    path("employee/<id>/add_to_team", views.add_to_team, name="add_to_team"),
    path("teams", views.teams, name="teams"),
    path("add_team", views.add_team, name="add_team"),
    path("team/<id>", views.team, name="team"),
    path("team/delete/<id>", views.delete_team, name="delete_team"),
    path("team/<id>/members", views.members, name="members"),
]
