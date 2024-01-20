![Screenshot (630)](https://github.com/Aditya-0-0-7/Git-Finder/assets/105495413/15e88d61-b262-40b8-a7b8-5c21358c6fe6)


The application is built as per instructions. All the required features as per given below has been implemented
1. The assignment has been done in pure HTML, CSS and javaScript.
2. The loading is shown when API calls are made.
3. pagination is server side and by default 10 repositories per page are displayed. The input text box has been provided using which user can set number of repositories per page max upto 100.

Along with above features some additional features have been implemented which are as follows:
1. When the user changes value in input text box of number of repositories per page then the repositories are updated only after 1 second of user stop typing. It has been implemented using debouncing and optimises the application.
2. A toast message is implemented which provides information to user about errors and illegal inputs.

Assumptions
1. Some information like repository description, topics, user bio, location, etc are not always available so when they are not available they are simply not displayed in the application.
2. The next and previous arrow in front and end of page number simply moves the page number tray and not changes the page. The page can be changed only by clicking on page number.

Note - When the application is runned it will display simply a search bar. Just enter the valid git hub user name and click search icon to display repos and profile details.

Note - the older and newer button present in the design has not been implemented because of unclarification about their functionality. I tried asking by messaging but did not got reply.

steps to run appliction on local
1. Download the code from repository.
2. On the downloded folder double click on index.html file.
