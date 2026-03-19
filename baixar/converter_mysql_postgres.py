import re
import os

def convert_mysql_to_postgres(input_file, output_dir):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    with open(input_file, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # Split into table blocks
    # A block starts with "CREATE TABLE `table_name`"
    table_blocks = re.split(r'CREATE TABLE `(\w+)`', content)
    
    # The split will result in [preamble, table1_name, table1_body, table2_name, table2_body, ...]
    
    for i in range(1, len(table_blocks), 2):
        table_name = table_blocks[i]
        table_body = table_blocks[i+1]
        
        # Extract inserts for this table
        # Inserts look like: INSERT INTO `table_name` (...) VALUES ...;
        insert_pattern = re.compile(rf'INSERT INTO `{table_name}`.*?VALUES(.*?);', re.DOTALL)
        inserts = insert_pattern.findall(table_body)
        
        # Clean up table body
        # Remove ENGINE, CHARSET, etc.
        clean_body = re.sub(r'\) ENGINE=.*?;', ');', table_body)
        
        # Convert types
        clean_body = clean_body.replace('`', '"')
        clean_body = re.sub(r'int\(\d+\)', 'INTEGER', clean_body)
        clean_body = re.sub(r'varchar\(\d+\)', 'TEXT', clean_body)
        clean_body = clean_body.replace('datetime', 'TIMESTAMP')
        clean_body = clean_body.replace('longtext', 'TEXT')
        clean_body = clean_body.replace('mediumtext', 'TEXT')
        clean_body = clean_body.replace('tinyint(1)', 'BOOLEAN')
        
        # Create SQL file
        with open(os.path.join(output_dir, f'migracao_{table_name}.sql'), 'w', encoding='utf-8') as out:
            out.write(f'-- MIGRACAO: {table_name}\n\n')
            out.write(f'CREATE TABLE IF NOT EXISTS "{table_name}" {clean_body}\n\n')
            
            for insert in inserts:
                out.write(f'INSERT INTO "{table_name}" VALUES {insert} ON CONFLICT DO NOTHING;\n')

# Run conversion
convert_mysql_to_postgres('baixar/ilinkbiocom_banco.sql', 'baixar/migracao_sql')
print("Conversão concluída!")
