(A) ***Code review for any problems or code smells in the app?***
=================================================================

1) Its better to use proper naming convention and avoid variable names like a or b and prefer giving meaningful name as in the book-search.component.html where the *ngFor for loop is initiated, replaced variable b and used "book" for the same.

2) Good practice to use pipe when want some date in respective format ,added the pipe in place of method formatDate in book-search.component.html.
3) addToReadingList & removeFromReadingList - in "reading-list.reducer.ts" file triggers the effects to call API to add & remove book to & from reading list and at the same time it updates the state by reducer without checking success or failure of backend APIs. Rectified it and it will only update it on success action.

4) Mobile UX was not correctly rendered. Book sections, reading list and buttons were overlapping. Corrected mobile view to provide better user experience.

----------------------------------------------------------------------------------------------------------
(B) ***Are there other improvements you would make to the app? What are they and why?***
=======================

1) Spinner should be implemented for better user experience for search API. **Implemented**

2) Error handling is not proper for the API failure scenario. It should display error message when there is a failure. Updated code to display error message. **Implemented**

----------------------------------------------------------------------------------------------------------
(C) ***Accessibility***
=======================

**Ran authomated scan using light house and corrected issues.**
1) Problem 1 - Buttons do not have an accessible name. **FIXED**

2) Problem 2 - Background and foreground do not have a sufficient contrast ratio. **FIXED**

3) Problem 3 - Alt attribute is missing in reading-list.component.html for image tag.  **FIXED**

**Manually checked using NVDA Accessiblity tool**
1) Search icon was reading as button. Added aria-label to make this more meaningful for the user. **FIXED**

2) Reading Reading List along with header an focus was not moving correctly. **FIXED**

3) Background color of Reading list button was same as header. Changed it to pink-dark color to make it visible to the user. **FIXED**

4) Added aria-label for Want to read button to make it read with book name.  **FIXED**