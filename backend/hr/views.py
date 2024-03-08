from django.shortcuts import get_object_or_404, redirect, render

from .forms import (
    AddressForm,
    AddToTeamForm,
    BasicInfoForm,
    NewContractForm,
    TeamForm,
    UpdateContractForm,
)
from .models import Address, BasicInfo, Contract, Employee, Team


def index(request):
    return render(request, "hr/index.haml")


def reset_db(request):
    if request.method == "GET":
        return render(request, "hr/reset_db.haml")
    else:
        BasicInfo.objects.all().delete()
        Contract.objects.all().delete()
        Address.objects.all().delete()
        Employee.objects.all().delete()
        Team.objects.all().delete()
        return redirect("hr:index")


def employees(request):
    return render(
        request,
        "hr/employees.haml",
        context={"employees": Employee.objects.all()},
    )


def employee(request, id):
    employee = get_object_or_404(Employee, pk=id)
    context = {"employee": employee}
    return render(request, "hr/employee.haml", context=context)


def delete_employee(request, id):
    employee = get_object_or_404(Employee, pk=id)
    if request.method == "GET":
        context = {"employee": employee}
        return render(request, "hr/delete_employee.haml", context=context)
    else:
        employee.delete()
        return redirect("hr:employees")


def add_employee(request):
    if request.method == "GET":
        address_form = AddressForm()
        basic_info_form = BasicInfoForm()
        contract_form = NewContractForm()
    else:
        address_form = AddressForm(request.POST)
        basic_info_form = BasicInfoForm(request.POST)
        contract_form = NewContractForm(request.POST)
        if (
            address_form.is_valid()
            and basic_info_form.is_valid()
            and contract_form.is_valid()
        ):
            address = address_form.save()
            basic_info = basic_info_form.save()
            contract = contract_form.save()
            Employee.objects.create(
                address=address, basic_info=basic_info, contract=contract
            )
            return redirect("hr:employees")
    return render(
        request,
        "hr/add_employee.haml",
        {
            "address_form": address_form,
            "basic_info_form": basic_info_form,
            "contract_form": contract_form,
        },
    )


def address(request, id):
    employee = get_object_or_404(Employee, pk=id)
    address = employee.address
    old_line2 = address.address_line1
    if request.method == "GET":
        form = AddressForm(instance=address)
    else:
        form = AddressForm(request.POST, instance=address)
        if form.is_valid():
            form.save()
            # BUG
            address.address_line2 = old_line2
            address.save()
            return redirect("hr:employee", id=id)
    return render(request, "hr/address.haml", {"form": form, "employee": employee})


def basic_info(request, id):
    employee = get_object_or_404(Employee, pk=id)
    basic_info = employee.basic_info
    if request.method == "GET":
        form = BasicInfoForm(instance=basic_info)
    else:
        form = BasicInfoForm(request.POST, instance=basic_info)
        if form.is_valid():
            form.save()
            return redirect("hr:employee", id=id)
    return render(request, "hr/basic_info.haml", {"form": form, "employee": employee})


def contract(request, id):
    employee = get_object_or_404(Employee, pk=id)
    contract = employee.contract
    if request.method == "GET":
        form = UpdateContractForm(instance=contract)
    else:
        form = UpdateContractForm(request.POST, instance=contract)
        if form.is_valid():
            form.save()
            return redirect("hr:employee", id=id)
    return render(request, "hr/contract.haml", {"form": form, "employee": employee})


def promote(request, id):
    employee = get_object_or_404(Employee, pk=id)
    context = {"employee": employee}
    if request.method == "POST":
        employee.is_manager = True
        employee.save()
        return redirect("hr:employees")
    else:
        return render(request, "hr/promote.haml", context=context)


def teams(request):
    return render(
        request,
        "hr/teams.haml",
        context={"teams": Team.objects.all()},
    )


def add_team(request):
    if request.method == "GET":
        form = TeamForm()
    else:
        form = TeamForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("hr:teams")

    return render(request, "hr/add_team.haml", {"form": form})


def team(request, id):
    team = get_object_or_404(Team, pk=id)
    return render(
        request,
        "hr/team.haml",
        context={"team": team},
    )


def members(request, id):
    team = get_object_or_404(Team, pk=id)
    members = Employee.objects.filter(team=team)
    return render(
        request,
        "hr/members.haml",
        context={"team": team, "members": members},
    )


def delete_team(request, id):
    team = get_object_or_404(Team, pk=id)
    if request.method == "GET":
        return render(
            request,
            "hr/delete_team.haml",
            context={"team": team},
        )
    else:
        team.delete()
        return redirect("hr:teams")


def add_to_team(request, id):
    employee = get_object_or_404(Employee, pk=id)
    if request.method == "GET":
        form = AddToTeamForm()
    else:
        form = AddToTeamForm(request.POST)
        if form.is_valid():
            employee.team = form.cleaned_data["team"]
            employee.save()
            return redirect("hr:employee", id=id)
    return render(
        request,
        "hr/add_to_team.haml",
        {
            "employee": employee,
            "form": form,
        },
    )
