export type Employee = {
    name: string;
    email: string;
    address_line1: string;
    address_line2: string;
    city: string;
    zip_code: string;
    hiring_date: string;
    job_title: string;
}

export type Team = {
    name: string;
}
export type Address = {
    address_line1: string;
    address_line2: string;
    city: string;
    zip_code: string;
}

export type Contract = {
    hiring_date: string;
    job_title: string;
}

export type BasicInfo = {
    name: string;
    email: string;
}