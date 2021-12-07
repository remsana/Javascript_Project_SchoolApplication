console.log("Javascript School Project");

let studentFirstName = document.querySelector("#firstName");
let studentLastName = document.querySelector("#lastName");
let studentAge = document.querySelector("#studentAge");

let sortFirstNameBtn = document.querySelector("#sortByFirstName");
let sortLastNameBtn = document.querySelector("#sortByLastName");
let sortAgeBtn = document.querySelector("#sortByAge");

//asynch function to fetch data
async function fetchData(URL) {
  let response = await fetch(URL);
  let data = await response.json();
  return data;
}

//async function to call the above function and start using the data
async function renderData() {
  let students = await fetchData("https://api.mocki.io/v2/01047e91/students");
  let schools = await fetchData("https://api.mocki.io/v2/01047e91/schools");

  //Creating the list of students by calling the function studentDataDisplay

  studentDataDisplay(students, schools);

  //-------------sorting the list------------------
  let ascendingFirstName = false;
  let ascendingLastName = false;
  let ascendingAge = false;

  sortFirstNameBtn.addEventListener("click", () => {
    clearDom();
    //console.log("first name sort clicked");
    let arrayFirstName = sortingArray(students, "firstName", ascendingFirstName);
    studentDataDisplay(arrayFirstName, schools);
    ascendingFirstName = !ascendingFirstName;
  });

  sortLastNameBtn.addEventListener("click", () => {
    clearDom();
    //console.log("Last name sort clicked");
    let arrayLastName = sortingArray(students, "lastName", ascendingLastName);
    studentDataDisplay(arrayLastName, schools);
    ascendingLastName = !ascendingLastName;
  });

  sortAgeBtn.addEventListener("click", () => {
    clearDom();
    //console.log("age clicked");
    let arrayAge = sortingArray(students, "age", ascendingAge);
    studentDataDisplay(arrayAge, schools);
    ascendingAge = !ascendingAge;
  });
  //console.log(students);

  //-------------Search Bar------------------

  let searchBar = document.querySelector("#searchType");
  let searchBtn = document.querySelector("#searchButton");

  //console.log(searchBar);

  searchBtn.addEventListener("click", () => {
    let userSearchText = searchBar.value.toLowerCase();
    let filteredStudents = students.filter((student) => {
      //console.log(`1,----- ${student.hobbies}`);
      let filteredHobbies = student.hobbies.filter((hobby) => {
        return hobby.toLowerCase().includes(userSearchText);
      });
      //console.log(`2,----- ${student.hobbies}`);
      //console.log(filteredHobbies.length);
      return (
        student.firstName.toLowerCase() == userSearchText ||
        student.lastName.toLowerCase() == userSearchText ||
        student.programme.toLowerCase().includes(userSearchText) ||
        filteredHobbies.length > 0
      );
    });
    clearDom();
    studentDataDisplay(filteredStudents, schools);
    
    
  });

  //---------filtering students based on programmes----------

  //looping through the students array to check for unique programmes
  let selectOptions = document.querySelector("#eduFilter");

  let programmeArray = [];
  students.forEach((object) => {
    if (!programmeArray.includes(object.programme))
      programmeArray.push(object.programme);
  });
  // console.log(programmeArray);

  //printing the list of programmes as options on DOM
  programmeArray.forEach((prog) => {
    let progOption = document.createElement("option");
    progOption.value = prog;
    progOption.textContent = prog;
    selectOptions.appendChild(progOption);
  });

  //event listener for filtering
  let progFilterBtn = document.querySelector("#progFilterBtn");

  progFilterBtn.addEventListener("click", () => {
    let userSelect = selectOptions.options[selectOptions.selectedIndex].value;
    console.log(userSelect);

    let newArrayForProg = students.filter((object) => {
      return object.programme == userSelect;
    });
    clearDom();
    studentDataDisplay(newArrayForProg, schools);
  });

  
}
renderData();

//------Functions-----

//variables for printing the list of schools on DOM
let schoolList = document.querySelector("#schoolList");
let schoolContent = document.querySelector(".modalContent");
let modalClose = document.querySelector("#closeBtn");

//creating UL based on the colors
let schoolListULGreen = document.createElement("ul");
let schoolListULYellow = document.createElement("ul");
let schoolListULRed = document.createElement("ul");

//appending all teh color ULs to a common container called schoolContent
schoolContent.append(schoolListULGreen, schoolListULYellow, schoolListULRed);

//Function to display the student list on DOM

//creating li for firstname
let studentDataDisplay = (studentArray, schoolArray) => {
  studentArray.forEach((student) => {
    let studentFirstNameList = document.createElement("li");
    studentFirstNameList.textContent = student.firstName;
    studentFirstNameList.style.listStyle = "none";
    studentFirstNameList.className = "firstNameClass";
    studentFirstName.appendChild(studentFirstNameList);

    //to get the school details for each student when clicked on firstname
    studentFirstNameList.addEventListener("click", () => {
      schoolList.style.display = "block";
      schoolListULGreen.innerHTML = ""; //To print the list only once
      schoolListULYellow.innerHTML = "";
      schoolListULRed.innerHTML = "";

      schoolArray.forEach((school) => {
        let activityMatch = "not match";
        let progMatch = "not match";

        school.programmes.forEach((prog) => {
          if (prog == student.programme) {
            progMatch = "match";
          }
        });

        if (school.activities == "No activities") {
          activityMatch = "not match";
        } else {
          school.activities.forEach((activity) => {
            student.hobbies.forEach((hobby) => {
              if (activity == hobby) {
                activityMatch = "match";
              }
            });
          });
        }
        //printing different schools that will be color-coded
        if (activityMatch == "match" && progMatch == "match") {
          let schoolNameLi = document.createElement("li");
          schoolNameLi.textContent = school.name;
          schoolNameLi.style.color = "green";
          schoolNameLi.style.fontWeight = "bold";
          schoolListULGreen.appendChild(schoolNameLi);
        } else if (activityMatch == "not match" && progMatch == "match") {
          let schoolNameLi = document.createElement("li");
          schoolNameLi.textContent = school.name;
          schoolNameLi.style.color = "rgb(252,174,1)";
          schoolListULYellow.appendChild(schoolNameLi);
        } else {
          let schoolNameLi = document.createElement("li");
          schoolNameLi.textContent = school.name;
          schoolNameLi.style.color = "red";
          schoolListULRed.appendChild(schoolNameLi);
        }
      });

      //Modal functionality to close the div
      modalClose.addEventListener("click", () => {
        schoolList.style.display = "none";
      });

      //       window.onclick = function (event) {
      // console.log(event);

      //         if (event.target == schoolList) {
      //           schoolList.style.display = "none";
      //         }
      //       };
    });
    //printing lastname
    let studentLastNameList = document.createElement("li");
    studentLastNameList.textContent = student.lastName;
    studentLastNameList.style.listStyle = "none";
    studentLastName.appendChild(studentLastNameList);

    //printing age
    let studentAgeList = document.createElement("li");
    studentAgeList.innerHTML = student.age;
    studentAgeList.style.listStyle = "none";
    studentAge.appendChild(studentAgeList);
  });
}

// Function to sort ascending and descending

let sortingArray = (array, sortBy, ascending) => {
  array.sort((a, b) => {
    if (a[sortBy] > b[sortBy]) return 1;
    if (a[sortBy] < b[sortBy]) return -1;
    return 0;
  });
  if (ascending) array.reverse();
  return array;
};

// function to clear DOM
let clearDom = () => {
  let listOfStudents = document.querySelectorAll("li");
  listOfStudents.forEach((element) => {
    element.remove();
  });
}
