# isic-tree-crwler

The isic-tree-crwler project is a two-stage data extraction tool (JavaScript and Python) designed to crawl and export hierarchical tree structures from the web, specifically targeting Iranian industrial product (ISIC) data

> Project Overview

This project automates the extraction of complex, dynamically loaded tree structures from web pages
It solves the challenge of capturing nested data by first expanding all branches via the browser console and then parsing the resulting HTML to generate a structured Excel report

> Key Features

* **Asynchronous Tree Expansion**: A specialized JavaScript function, **safeExpandTree**, programmatically clicks and expands every branch and sub-branch in the browser with a configurable delay to handle network latency

* **Precision Web Scraping**: Utilizes the **BeautifulSoup** Python library to navigate the HTML DOM and extract critical fields such as Product ID, Title, Tree Level, and Node Type (Branch vs. Leaf)

* **Formatted Excel Output**: Data is saved into isic_data.xlsx using Openpyxl, featuring proper alignment and Right-to-Left (RTL) support for Persian text

* **Extraction Metrics**: Provides a summary at the end of the process, detailing the total number of records captured and a breakdown of categories and products

> Tech Stack

* **JavaScript**: For DOM manipulation and asynchronous tree expansion
* **Python3**: For offline data processing and file generation
* **BeautifulSoup4**: For robust HTML parsing
* **Openpyxl**: For creating and formatting Excel spreadsheets 

> Workflow

* **Browser-Side Expansion**: Execute the **safeExpandTree** script in the browser's developer console while on the target website
This ensures all "lazy-loaded" or hidden data is visible in the DOM. Once finished, save the page as an HTML file (e.g., **isic_tree.html**)

* **Server-Side Parsing**: The Python script processes the saved HTML file 
It targets the **table#isic_tree** element, iterates through the rows, and converts the visual hierarchy into a structured data format

> Data Structure

The final output includes the following attributes for every item

* **Product ID**: The unique numerical code for the item.
* **Title**: The Persian name/description of the product or category.
* **Tree Layer**: The depth of the item within the hierarchy.
* **Node Type**: Categorizes the entry as a "Branch" (category) or "Leaf" (final product)

> [!NOTE]
> This project follows a two-stage extraction process: first, an asynchronous JavaScript script expands the tree structure in your browser, and then a Python script parses the saved HTML to generate an Excel file

> [!TIP]
> If you have a slower internet connection, you can increase the delay parameter in the safeExpandTree(delay) function (e.g., delay = 1000) to ensure all sub-branches have enough time to load before the script moves to the next one

> [!IMPORTANT]
> After running the JavaScript script and fully expanding the tree, you must save the web page as an HTML file named isic_tree.html in the root directory for the Python parser to function correctly

> [!WARNING]
> Ensure the target website remains the active tab while the safeExpandTree script is running.  closing the tab will interrupt the expansion process and result in incomplete data
