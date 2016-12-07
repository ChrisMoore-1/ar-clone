select *
from patients p
join messages m
on p.id = m.patientid;
