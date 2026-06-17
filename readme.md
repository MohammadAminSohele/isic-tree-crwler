# isic-tree-crwler

The isic-tree-crwler project is a two-stage data extraction tool (JavaScript and Python) designed to crawl and export hierarchical tree structures from the web, specifically targeting Iranian industrial product (ISIC) data

<img width="2752" height="1536" alt="HTML_to_Spreadsheet_Transformation_Pipeline" src="https://github.com/user-attachments/assets/82ed1076-71f8-404a-b05c-ad5a6740fc52" />

> Project Overview

This project automates the extraction of complex, dynamically loaded tree structures from web pages
It solves the challenge of capturing nested data by first expanding all branches via the browser console and then parsing the resulting HTML to generate a structured Excel report

> Key Features

**Asynchronous Tree Expansion**: A specialized JavaScript function, **safeExpandTree**, programmatically clicks and expands every branch and sub-branch in the browser with a configurable delay to handle network latency

**Precision Web Scraping**: Utilizes the **BeautifulSoup** Python library to navigate the HTML DOM and extract critical fields such as Product ID, Title, Tree Level, and Node Type (Branch vs. Leaf)

**Formatted Excel Output**: Data is saved into isic_data.xlsx using Openpyxl, featuring proper alignment and Right-to-Left (RTL) support for Persian text

**Extraction Metrics**: Provides a summary at the end of the process, detailing the total number of records captured and a breakdown of categories and products

> Workflow

**Browser-Side Expansion**: Execute the **safeExpandTree** script in the browser's developer console while on the target website
This ensures all "lazy-loaded" or hidden data is visible in the DOM. Once finished, save the page as an HTML file (e.g., **isic_tree.html**)

**Server-Side Parsing**: The Python script processes the saved HTML file 
It targets the **table#isic_tree** element, iterates through the rows, and converts the visual hierarchy into a structured data format

> Tech Stack

* **JavaScript**: For DOM manipulation and asynchronous tree expansion
* **Python3**: For offline data processing and file generation
* **BeautifulSoup4**: For robust HTML parsing
* **Openpyxl**: For creating and formatting Excel spreadsheets

> [!NOTE]
> Useful information that users should know, even when skimming content.

> [!TIP]
> Helpful advice for doing things better or more easily.

> [!IMPORTANT]
> Key information users need to know to achieve their goal.

> [!WARNING]
> Urgent info that needs immediate user attention to avoid problems.

> [!CAUTION]
> Advises about risks or negative outcomes of certain actions.
