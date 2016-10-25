# Project Verano

This is a personal project between some college students over the summer of 2016. Feel free to look around, though there may not be much to see. Contact matthewrastovac@yahoo.com if you have any questions or requests. This code is purposely simplified in many places, and it's entirely likely that there are inefficiencies contained within.

# Accessing the Demo

1. Install flask ("pip install flask" in cmd)
2. Run server.py
3. Go to 127.0.0.1:5000 in a browser

Note that the demo only uses the start and end date values as parameters. The train date and algorithms don't change anything. When we complete an estimation algorithm, I will hook it up and it will display with the other selected algorithms.

# Python Conventions

Here are some of the conventions for Python I will be enforcing:

1. Indentation is done with TABS. NOT SPACES. Refer to PEP 8 for indentation practices.
2. Variable names use all lowercase with underscores. No camelcase. Class names can be capitalized.
3. Non-structure (integers, floats, strings, etc.) variable names should be singular (name, order, etc.).
4. Structure (list, dict, etc.) variable names should be plural (names, orders, etc.)
5. Class names should be only one word unless it is difficult to find a fitting one-word name for it.
6. Please try to use good abstraction practices. This means creating a new module for functions that perform similar functions.
7. Put 3 empty lines between functions unless they are all small and related functions, in which case put 1 empty line between them.
8. Separate blocks of functions that perform separate tasks by 5 empty lines.
9. Add comments before a function explaining what that function should do and include any external docs (links).
10. Add comments explaining complex code before the line in question. Only add inline comments if they are very short.
11. Always add test cases inside an `if __name__ == "__main__":` clause. There should almost never be code left in the global space.
12. Debugging print statements should be deleted or commented out before a commit, depending on how complex the statement is.
13. Only type comments in all capital letters if it indicates a critical error.
14. For any heavily mathematical function or module, include a variable index above the section to indicate the purpose of each variable.
15. Use string concatenation instead of string replacement when possible for clarity.
