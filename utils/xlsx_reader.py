import pandas as pd

# 读取 Excel 文件（默认读取第一个工作表）
df = pd.read_excel('sin_points.xlsx', header=None)

x_col = df.iloc[:, 0].values  # 第一列所有行
y_col = df.iloc[:, 1].values  # 第二列所有行

result = [[round(float(x), 2), round(float(y), 2)] for x, y in zip(x_col, y_col)]

print(result)
print(len(result))
# ///////////////////////////////////////////////////////////////////////////////////////////////////
