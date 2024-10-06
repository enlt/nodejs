# import os
# def print_and_write_directory_structure(directory, output_file="output.txt"):
    # with open(output_file, 'w') as f_out:
        # for root, dirs, files in os.walk(directory):
            # # 忽略以 "." 开头的文件夹
            # dirs[:] = [d for d in dirs if not d.startswith('.')]
            # level = root.replace(directory, '').count(os.sep)
            # indent_level = '│   ' * level + '├── ' if level > 0 else ''
            # line = f"{indent_level}{os.path.basename(root)}/\n"
            # print(line, end='')
            # f_out.write(line)
            
            # sub_indent = '│   ' * (level + 1) + '├── '
            # for f in files:
                # line = f"{sub_indent}{f}\n"
                # print(line, end='')
                # f_out.write(line)
# directory = input("请输入目录路径: ")
# print_and_write_directory_structure(directory)

import os
input_path = input("请输入路径: ")
input_string = input("请输入字符串: ")
files = os.listdir(input_path)
output_lines = [input_string + file for file in files]
with open("output.txt", "w") as f:
    for line in output_lines:
        f.write(line + "\n")