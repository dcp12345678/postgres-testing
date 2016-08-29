DELETE FROM person;
DELETE FROM dept;

INSERT INTO dept (NAME) VALUES ('Accounting');
INSERT INTO dept (NAME) VALUES ('Information Technology');

INSERT INTO person ( last_name
                   , first_name
                   , address
                   , age
                   , dept_id )
              SELECT 'Smith'
                   , 'Joey'
                   , '123 Nowhere Street Omaha, NE 12345'
                   , 45
                   , id
                FROM dept
               WHERE NAME = 'Accounting';

INSERT INTO person ( last_name
                   , first_name
                   , address
                   , age
                   , dept_id )
              SELECT 'Jones'
                   , 'Willie'
                   , '18 Anywhere Drive Miami, FL 54321'
                   , 49
                   , id
                FROM dept
               WHERE NAME = 'Information Technology';
