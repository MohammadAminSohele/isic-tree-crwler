from bs4 import BeautifulSoup
import json
import re
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment, PatternFill
from openpyxl.utils import get_column_letter

def parse_isic_tree(html_content):
    """
    Extracts information (code, title, level, type) from the ISIC tree in the HTML file.
    """
    soup = BeautifulSoup(html_content, 'html.parser')
    rows = soup.select('table#isic_tree tbody tr')

    results = []
    for row in rows:
        # 1.extract code 
        code_td = row.find('td')
        if not code_td:
            continue
        code = code_td.get_text(strip=True)

        # 2. extract title,level
        title_span = row.select_one('td:nth-of-type(2) span.fancytree-title')
        if not title_span:
            continue
        title = title_span.get_text(strip=True)

        # calculate level from padding-right
        node_span = row.select_one('td:nth-of-type(2) span.fancytree-node')
        level = 1
        if node_span and node_span.get('style'):
            style = node_span['style']
            match = re.search(r'padding-right:\s*(\d+)px', style)
            if match:
                padding = int(match.group(1))
                level = (padding // 20) + 1

        # 3. detect branch,leaf
        row_classes = row.get('class', [])
        
        if 'fancytree-folder' in row_classes:
            expander = row.select_one('td:nth-of-type(2) span.fancytree-expander')
            if expander and 'fancytree-expander' in expander.get('class', []):
                if 'fancytree-empty' not in expander.get('class', []):
                    node_type = 'شاخه'
                else:
                    node_type = 'برگ'
            else:
                node_type = 'برگ'
        else:
            node_type = 'برگ'

        results.append({
            'کدمحصول': code,
            'عنوان': title,
            'لایه درخت': level,
            'نوع': node_type
        })

    return results

def save_to_excel(data, filename='isic_data.xlsx'):
    """
    store extracted data in excel with format right to left
    """
    # Create worksheet
    wb = Workbook()
    ws = wb.active
    ws.title = "درختواره محصولات"

    # Set header with new name
    headers = ['کدمحصول', 'عنوان', 'لایه درخت', 'نوع']
    
    # Set style for header (right to left)
    header_font = Font(name='B Nazanin', size=12, bold=True, color='FFFFFF')
    header_fill = PatternFill(start_color='4150B7', end_color='4150B7', fill_type='solid')
    header_alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
    
    # Write header in first row (right to left)
    for col_idx, header in enumerate(headers, 1):
        cell = ws.cell(row=1, column=col_idx, value=header)
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = header_alignment
    
    # set style for data(Align Right)
    data_font = Font(name='B Nazanin', size=11)
    data_alignment_right = Alignment(horizontal='right', vertical='center', wrap_text=True)
    data_alignment_center = Alignment(horizontal='center', vertical='center', wrap_text=True)
    
    # Counting row number start from row 2 (row 1 set for header)
    for row_idx, item in enumerate(data, 2):
        
        # Column 1 : ProductCode(Center)
        cell = ws.cell(row=row_idx, column=1, value=item['کدمحصول'])
        cell.font = data_font
        cell.alignment = data_alignment_center
        
        # Column 2 : Title(Align Right)
        cell = ws.cell(row=row_idx, column=2, value=item['عنوان'])
        cell.font = data_font
        cell.alignment = data_alignment_right
        
        # ستون 3: لایه درخت (وسط‌چین)
        # Column 3 : Tree layer(Center)
        cell = ws.cell(row=row_idx, column=3, value=item['لایه درخت'])
        cell.font = data_font
        cell.alignment = data_alignment_center
        
        # ستون 4: نوع (وسط‌چین)
        # Column 4 : Type(Center)
        cell = ws.cell(row=row_idx, column=4, value=item['نوع'])
        cell.font = data_font
        cell.alignment = data_alignment_center
        
        # Coloring Rows base on type
        if item['نوع'] == 'شاخه':
            fill = PatternFill(start_color='E6F3FF', end_color='E6F3FF', fill_type='solid')
            for col in range(1, 5):
                ws.cell(row=row_idx, column=col).fill = fill
        else:  
            fill = PatternFill(start_color='F0FFF0', end_color='F0FFF0', fill_type='solid')
            for col in range(1, 5):
                ws.cell(row=row_idx, column=col).fill = fill
    
    # set width of Columns
    ws.column_dimensions['A'].width = 20  # Product Code
    ws.column_dimensions['B'].width = 50  # Title
    ws.column_dimensions['C'].width = 15  # Tree layer
    ws.column_dimensions['D'].width = 15  # Type
    
    # Set page as Right to Left
    ws.sheet_view.rightToLeft = True
    
    # Freese Row 1 (headers)
    ws.freeze_panes = 'A2'

    # Store File
    wb.save(filename)
    print(f"فایل Excel با موفقیت در '{filename}' ذخیره شد.")
    print(f"تعداد {len(data)} رکورد ذخیره شد.")
    print("جهت صفحه: راست به چپ (RTL)")

""" Use From HTML File Source """

# Read HTML File
with open('isic_tree.html', 'r', encoding='utf-8') as f:
    html_data = f.read()

# Extract Data
parsed_data = parse_isic_tree(html_data)

# Store in Excel
save_to_excel(parsed_data, 'isic_data.xlsx')

# show Statistics
branches = sum(1 for item in parsed_data if item['نوع'] == 'شاخه')
leaves = sum(1 for item in parsed_data if item['نوع'] == 'برگ')
print(f"\nآمار استخراج شده:")
print(f"تعداد کل: {len(parsed_data)}")
print(f"تعداد شاخه‌ها: {branches}")
print(f"تعداد برگ‌ها: {leaves}")

# Show some of data for confirmation
print("\nنمونه‌هایی از داده‌های استخراج شده:")
for item in parsed_data[:5]:
    print(f"کدمحصول: {item['کدمحصول']}, عنوان: {item['عنوان'][:30]}..., لایه درخت: {item['لایه درخت']}, نوع: {item['نوع']}")