# Система управления задачами (Task managment system)

- **цель работы:**  облегчить преподавателям и пользователям контроль за выполнением задания и предоставить студенту функционал для облегчения получения информации о задачи;
- **перечень функциональных требований:**

  1. Обеспечить администратору возможность регистрирования новых пользователей, а также созданию учебные группы.
  2. Обеспечить преподавателю возможность добавлять в систему тесты, добавлять задачи и проверяет статус выполнение задач.
  3. Предоставить студенту возможность решать задачи, читать задачи и проверить результаты.
- **use-case diagram**

  ![use-case.drawio](image/readme/use-case.drawio.png)
- **BPMN диаграмма основных бизнес-процессов**
	- авотризации
		- ![auth-bpmn](image/readme/auth-bpmn.png)
	- решить тест
		- ![solve-test](image/readme/solve-test.png)
- **Диаграмма БД**
  ![1696454970227](image/readme/1696454970227.png)
- **ER-диаграмма сущностей**

  ![1696454813041](image/readme/1696454813041.png)
- **Компонентная диаграмма системы**
  ![architecture.drawio](image/readme/architecture.drawio.png)

- **Экраны будущего web-приложения**
  -  **страница авторизации** 
  	- ![login-page.drawio](image/readme/login-page.png)
  - **курсы студента** 
  	- ![student-course.drawio](image/readme/student-course.png)
  - **тесты студента** 
  	- ![student-test.drawio](image/readme/student-test.png)
  -  **страница преподавалтели/менторы** 
  	- ![teacher-test.drawio](image/readme/teacher-test.png)
  -  **страница ответы на тесты** 
 	- ![teacher-test-ans.drawio](image/readme/teacher-test-ans.png)
