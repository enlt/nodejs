import os

def print_and_write_directory_structure(directory, output_file="directory.txt"):
    with open(output_file, 'w') as f_out:
        for root, dirs, files in os.walk(directory):
            # 忽略以 "." 开头的文件夹
            dirs[:] = [d for d in dirs if not d.startswith('.')]
            level = root.replace(directory, '').count(os.sep)
            indent_level = '│   ' * level + '├── ' if level > 0 else ''
            line = f"{indent_level}{os.path.basename(root)}/\n"
            print(line, end='')
            f_out.write(line)
            
            sub_indent = '│   ' * (level + 1) + '├── '
            for f in files:
                line = f"{sub_indent}{f}\n"
                print(line, end='')
                f_out.write(line)

# 获取用户输入的目录
directory = input("请输入目录路径: ")

# 输出文件默认为 "directory.txt"
print_and_write_directory_structure(directory)