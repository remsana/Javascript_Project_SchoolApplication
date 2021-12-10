console.log("Javascript School Project");

//ULs where all Li's will be appended
let studentFirstName = document.querySelector("#firstName");
let studentLastName = document.querySelector("#lastName");
let studentAge = document.querySelector("#studentAge");

//the labels which when clicked will sort the list
let sortByFirstName = document.querySelector("#sortByFirstName");
let sortByLastName = document.querySelector("#sortByLastName");
let sortByAge = document.querySelector("#sortByAge");

//Fetch data using asynv and await
async function fetchData(URL) {
  let response = await fetch(URL);
  let data = await response.json();
  return data;
}

//Calling the above function and start using the data
async function renderData() {
  let students = await fetchData("https://api.mocki.io/v2/01047e91/students");
  let schools = await fetchData("https://api.mocki.io/v2/01047e91/schools");

  //Creating the list of students by calling the function studentDataDisplay

  let filteredArrayOfStudents = [...students]; //cloning the students array so when we reset it the original order can be printed on DOM
  studentDataDisplay(filteredArrayOfStudents, schools);

  //-------------sorting the list------------------//

  //declaring the ascendng values as false so sorting both ways (asscending and descending) is possible

  let ascendingFirstName = false;
  let ascendingLastName = false;
  let ascendingAge = false;

  //sorting by fisrtname
  sortByFirstName.addEventListener("click", () => {
    clearDom();
    let arrayFirstName = sortingArray(
      filteredArrayOfStudents,
      "firstName",
      ascendingFirstName
    );
    studentDataDisplay(arrayFirstName, schools);
    ascendingFirstName = !ascendingFirstName; //making it true will only sort it once

    if (ascendingFirstName) {
      sortByFirstName.innerHTML = `First Name &#9650`;
    } else {
      sortByFirstName.innerHTML = `First Name &#9660`;
    }
    schoolList.style.display = "none";
    console.log(students);
    console.log(filteredArrayOfStudents);
  });

  //sorting by lastname
  sortByLastName.addEventListener("click", () => {
    clearDom();
    let arrayLastName = sortingArray(
      filteredArrayOfStudents,
      "lastName",
      ascendingLastName
    );
    studentDataDisplay(arrayLastName, schools);
    ascendingLastName = !ascendingLastName;

    if (ascendingLastName) {
      sortByLastName.innerHTML = `Last Name &#9650`;
    } else {
      sortByLastName.innerHTML = `Last Name &#9660`;
    }
    schoolList.style.display = "none";
  });

  //sorting by age
  sortByAge.addEventListener("click", () => {
    clearDom();
    let arrayAge = sortingArray(filteredArrayOfStudents, "age", ascendingAge);
    studentDataDisplay(arrayAge, schools);
    ascendingAge = !ascendingAge;

    if (ascendingAge) {
      sortByAge.innerHTML = `age &#9650`;
    } else {
      sortByAge.innerHTML = `age &#9660`;
    }
    schoolList.style.display = "none";
  });

  //-------------Search Bar------------------//

  let searchBar = document.querySelector("#searchType"); //where user types
  let searchBtn = document.querySelector("#searchButton"); //the enter button

  searchBtn.addEventListener("click", () => {
    if (searchBar.value == "") {
      alert("Please enter text to proceed..");
    } else {
      let userSearchText = searchBar.value.toLowerCase();
      filteredArrayOfStudents = students.filter((student) => {
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
    }
    searchBar.value = "";
    schoolList.style.display = "none";
    clearDom();
    studentDataDisplay(filteredArrayOfStudents, schools);
  });

  //---------filtering students based on programmes from drop-down----------//

  //select element from HTML
  let selectOptions = document.querySelector("#eduFilter");

  //looping through the students array to check for unique programmes
  let programmeArray = [];
  students.forEach((object) => {
    if (!programmeArray.includes(object.programme))
      programmeArray.push(object.programme);
  });

  //printing the list of programmes as options on DOM
  programmeArray.forEach((prog) => {
    let progOption = document.createElement("option");
    progOption.value = prog;
    progOption.textContent = prog;
    selectOptions.appendChild(progOption);
  });

  //event listener for filtering

  selectOptions.addEventListener("change", () => {
    let userSelect = selectOptions.options[selectOptions.selectedIndex].value;
    filteredArrayOfStudents = students.filter((object) => {
      return object.programme == userSelect;
    });
    clearDom();
    studentDataDisplay(filteredArrayOfStudents, schools);
    schoolList.style.display = "none";
  });

  //reset buton

  let resetButton = document.querySelector("#resetBtn");

  resetButton.addEventListener("click", () => {
    clearDom();
    schoolList.style.display = "none";
    searchBar.value = "";
    selectOptions[0].selected = true;

    filteredArrayOfStudents = [...students];
    studentDataDisplay(filteredArrayOfStudents, schools);

    sortByFirstName.innerHTML = `First Name &#9650 &#9660`;
    sortByLastName.innerHTML = `Last Name &#9650 &#9660`;
    sortByAge.innerHTML = `Age &#9650 &#9660`;

    console.log(students);
    console.log(filteredArrayOfStudents);
  });
}
renderData();

//------Functions-----//

// 1. Function for displaying the list of students and schools on Dom

//variables for printing the list of schools on DOM
let schoolList = document.querySelector("#schoolList");
let schoolContent = document.querySelector(".modalContent");
let modalClose = document.querySelector("#closeBtn");

//creating UL based on the colors
let schoolListULGreen = document.createElement("ul");
let schoolListULYellow = document.createElement("ul");
let schoolListULRed = document.createElement("ul");

//appending all the color ULs to a common container called schoolContent
schoolContent.append(schoolListULGreen, schoolListULYellow, schoolListULRed);

//Function to display the student list on DOM

//creating li for firstname
let studentDataDisplay = (studentArray, schoolArray) => {
  studentArray.forEach((student) => {
    let studentFirstNameList = document.createElement("li");
    studentFirstNameList.textContent = student.firstName;
    studentFirstNameList.style.listStyle = "none";
    studentFirstNameList.className = "firstNameClass"; //to style it later
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
        //printing schools that will be color-coded
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
};

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
};
