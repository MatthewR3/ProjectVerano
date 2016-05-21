
# Project Verano

This is the repository for all of our code for the project. Please make sure you commit after any changes, because I hate dealing with conflicts.

Here are some of the conventions for Python I will be enforcing:

1. Indentation is done with TABS. NOT SPACES. Refer to PEP 8 for indentation practices.
2. Variable names use all lowercase with underscores. No camelcase. Class names can be capitalized.
3. Non-structure (integers, floats, strings, etc.) variable names should be singlular (name, order, etc.).
4. Structure (list, dict, etc.) variable names should be plural (names, orders, etc.)
5. Class names should be only one word unless it is difficult to find a fitting one-word name for it.
6. Please try to use good abstracton practices. This means creating a new module for functions that perform similar functions.
7. Put 3 empty lines between functions unless they are all very small helper functions, in which case put 1 empty line between them.
8. Separate blocks of functions that perform separate functions by 5 empty lines.
9. Add comments before a function explaining what that function should do and include any external docs (links)
10. Add comments explaining complex code before the line in question. Only add inline comments if they are very short
11. Always add test cases inside an `if __name__ == "__main__":` clause. There should almost never be code left in the global space.
12. Debugging print statements should be deleted or commented out before a commit, depending on how complex the statement is.
13. Only type comments in all capital letters if it indicates a critical error
14. For any heavily mathematical function or module, include a variable index above the section to indicate the purpose of each variable
15. Use string concatenation instead of string replacement for clarity.
>>>>>>> origin/master
