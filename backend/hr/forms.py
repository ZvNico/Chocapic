from django import forms

from .models import Address, BasicInfo, Contract, Team


class AddressForm(forms.ModelForm):
    class Meta:
        model = Address
        fields = ["address_line1", "address_line2", "city", "zip_code"]
        labels = {
            "address_line1": "",
            "address_line2": "",
        }


class BasicInfoForm(forms.ModelForm):
    class Meta:
        model = BasicInfo
        fields = ["name", "email"]


class NewContractForm(forms.ModelForm):
    class Meta:
        date_widget = forms.DateInput()
        date_widget.input_type = "date"
        model = Contract
        fields = ["hiring_date", "job_title"]
        widgets = {"hiring_date": date_widget}


class UpdateContractForm(forms.ModelForm):
    class Meta:
        date_widget = forms.DateInput(attrs={"readonly": True})
        date_widget.input_type = "date"
        model = Contract
        fields = ["hiring_date", "job_title"]
        widgets = {"hiring_date": date_widget}


class TeamForm(forms.ModelForm):
    class Meta:
        model = Team
        fields = ["name"]

    def clean(self):
        super().clean()
        name = self.cleaned_data["name"]
        with_same_name = Team.objects.filter(name=name)
        if with_same_name:
            self.add_error("name", "a team with the same name already exists")


class AddToTeamForm(forms.Form):
    team = forms.ModelChoiceField(queryset=Team.objects)
