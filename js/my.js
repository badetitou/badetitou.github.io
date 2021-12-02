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
	const toggleSwitch = document.querySelector('#theme-switch input[type="checkbox"]');

	//function that changes the theme, and sets a localStorage variable to track the theme between page loads
	function switchTheme(e) {
		if (e.target.checked) {
			localStorage.setItem('theme', 'dark');
			document.documentElement.setAttribute('data-theme', 'dark');
			toggleSwitch.checked = true;
		} else {
			localStorage.setItem('theme', 'light');
			document.documentElement.setAttribute('data-theme', 'light');
			toggleSwitch.checked = false;
		}    
	}

	//listener for changing themes
	toggleSwitch.addEventListener('change', switchTheme, false);

	//pre-check the dark-theme checkbox if dark-theme is set
	if (document.documentElement.getAttribute("data-theme") == "dark"){
		toggleSwitch.checked = true;
	}
});
