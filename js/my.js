// make all images responsive
$(function() {
	$("img").addClass("img-responsive");
});

// responsive tables
$(document).ready(function() {
	$("table").wrap("<div class='table-responsive'></div>");
	$("table").addClass("table");
});

$(document).ready(function() {
	//identify the toggle switch HTML element
	const toggleSwitch = document.querySelector('#theme-switch');

	//function that changes the theme, and sets a localStorage variable to track the theme between page loads
	function switchTheme(e) {
		if (localStorage.getItem('theme') === 'light') {
			localStorage.setItem('theme', 'dark');
		} else if (localStorage.getItem('theme') === 'dark') {
			localStorage.removeItem('theme');
		} else {
			localStorage.setItem('theme', 'light');
		}
		setTheme();
	}

	//listener for changing themes
	toggleSwitch.addEventListener('click', switchTheme);

	function setTheme() {
		toggleSwitch.classList.remove('fa-sun', 'fa-moon', 'fa-desktop')
		if (localStorage.getItem('theme') === 'light') {
			toggleSwitch.classList.add('fa-sun');
			document.documentElement.setAttribute('data-theme', 'light');
		} else if (localStorage.getItem('theme') === 'dark') {
			toggleSwitch.classList.add('fa-moon');
			document.documentElement.setAttribute('data-theme', 'dark');
		} else {
			toggleSwitch.classList.add('fa-desktop');
			if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
				document.documentElement.setAttribute('data-theme', 'dark');
			} else {
				document.documentElement.setAttribute('data-theme', 'light');
			}
		}
	}

	setTheme();
});
