SELECT p.first_name
     , p.last_name
     , p.address
     , p.age
     , p.dept_id
     , d.name dept_name
  FROM person p
     , dept d
 WHERE p.dept_id = d.id;