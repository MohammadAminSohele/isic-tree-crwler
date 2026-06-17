# isic-tree-crwler

The isic-tree-crwler project is a two-stage data extraction tool (JavaScript and Python) designed to crawl and export hierarchical tree structures from the web, specifically targeting Iranian industrial product (ISIC) data

<img width="2752" height="1536" alt="HTML_to_Spreadsheet_Transformation_Pipeline" src="https://github.com/user-attachments/assets/24b99f60-866d-4888-b577-fd3bf5931eae" />

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

<img width="225" height="225" alt="javascript" src="https://github.com/user-attachments/assets/53fef973-be15-4c63-8d55-50c0c1e29608" /> <img width="225" height="225" alt="python" src="https://github.com/user-attachments/assets/d90a5fd0-4a38-425a-b52e-751cf852fe04" /> 

<img width="300" height="168" alt="Openpyxl" src="https://github.com/user-attachments/assets/a4dbe8ba-8de0-4629-9340-a826636c146a" /> <img width="396" height="127" alt="beautifulsoup" src="https://github.com/user-attachments/assets/6bbb171a-72d2-4736-b5d8-b29c22a32846" /> 




To install Package use below command

`pip install -r requirements.txt`

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

<img width="3028" height="4937" alt="NotebookLM Mind Map (1)" src="https://github.com/user-attachments/assets/1d276eb7-6ea9-4c14-bd44-9970f8b21378" />

> [!NOTE]
> This project follows a two-stage extraction process: first, an asynchronous JavaScript script expands the tree structure in your browser, and then a Python script parses the saved HTML to generate an Excel file

> [!TIP]
> If you have a slower internet connection, you can increase the delay parameter in the safeExpandTree(delay) function (e.g., delay = 1000) to ensure all sub-branches have enough time to load before the script moves to the next one

> [!IMPORTANT]
> After running the JavaScript script and fully expanding the tree, you must save the web page as an HTML file named isic_tree.html in the root directory for the Python parser to function correctly

> [!WARNING]
> Ensure the target website remains the active tab while the safeExpandTree script is running.  closing the tab will interrupt the expansion process and result in incomplete data
