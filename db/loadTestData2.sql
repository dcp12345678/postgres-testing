INSERT INTO person ( last_name
                   , first_name
                   , address
                   , age
                   , dept_id )
              SELECT 'Harris'
                   , 'Harry'
                   , '555 Abc Drive Reno, NV 11223'
                   , 45
                   , id
                FROM dept
               WHERE NAME = $1;
