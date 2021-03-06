# 系统模块

系统中所有的模块查看和模块中的按钮都受权限控制，权限控制字符会在管理员登录的时候返回给前端，前端将其存在 `sessionStorage` 中，超级管理员拥有所有权限。

系统所有页面的中有树结构的，其树结构和搜索框功能整个逻辑封装在业务组件 `nodeTree` 中，详细看组件代码。

字典、菜单管理、机构管理和角色管理，起始是左侧树结构，右侧默认图，当对树节点进行增删改操作时都会刷新整个树，右侧恢复成默认图，用户需要重新点击节点查询数据。

所有页面的表格数据进行删除操作的时候都会返回到第一页。

## 管理员管理

管理员管理提供对管理员相关信息的管理，包括通讯录管理权限、数据权限、角色等的管理。本系统默认就创建了 admin 账号，无需分配任何角色，就拥有最高权限。一个管理员是可以拥有多个角色的。非 admin 账号，只能查看及管理自己创建的账号。

#### 管理员列表

管理员列表页面由左侧组织部门树和右侧管理员列表构成，默认选中根节点查询根节点下的管理员，即所有的子管理员账号数据。

管理员列表是由左侧树节点中 `id` 和 `dpath` 参数进行筛选。每条子管理员数据都有 5 个操作按钮（按钮权限由菜单管理控制），分别是编辑、查看、禁用、重置密码和删除。其中重置密码是后台会返回一个随机密码。

#### 新增/编辑管理员

<style>
table th:first-of-type {width: 100px;}
table th:nth-of-type(2) { width: 200px;}
table th:nth-of-type(3) { width: 200px;}
</style>

新增/编辑管理员页面包含以下字段，编辑页面不包含密码字段：

|     字段名     |                                 规则                                 |              权限              |
| :------------: | :------------------------------------------------------------------: | :----------------------------: |
|      姓名      |                       必填，只能是中文或者英文                       |               -                |
|      账号      | 必填，帐号长度 3-16 个字符，由字母、数字、点(.)、减号(-)或下划线(\_) |               -                |
|      性别      |                必填，调用动态字典接口获取字典和 code                 |               -                |
|    登录密码    | 必填，密码长度为 6-16 个字，必须同时包含字母、数字、特殊符号中的两种 |               -                |
|    确认密码    |                         必填，和登录密码一致                         |               -                |
|    所属部门    |                       必填，部门只可以选择一个                       |               -                |
| 绑定通讯录用户 |                          用户只可以选择一个                          |   通讯录用户不可以被重复绑定   |
| 通讯录管理权限 |                          通讯录部门可以多选                          | 被选择的部门的上层部门将被置灰 |
|  部门管理权限  |                        必填，机构部门可以多选                        | 被选择的部门的上层部门将被置灰 |
|    角色授权    |                                  -                                   | 控制管理员账号查看菜单模块权限 |

#### 管理员详情

管理员详情页面包括以下字段：姓名、账号、性别、所属部门、绑定通讯录用户、通讯录管理权限、部门管理权限和角色，其中角色字段鼠标移上去会显示一个气泡框，里面是一个权限树内容，告知此管理员所拥有的权限，但权限树中的节点都是禁用状态不可以更改。

## 角色管理

角色管理用于对角色的管理和维护，包括对角色的增加、修改、删除，并对角色所关联的账号进行管理。通过角色关联菜单、账号和管理组，实现系统权限的控制。管理员权限是通过角色进行管理的，给管理员分配权限时，要先创建好角色。

角色树中上级角色和下级角色中权限没有关联，每一个角色的权限都是单独个体，所以可能会存在子角色的权限大于上级角色，角色权限的配置是由超级管理员进行配置，所以此类问题只能人为控制。

#### 角色管理列表

角色管理列表页面由左侧角色树和右侧的默认图构成，用户选中角色就可以查询到当前角色下关联的管理员，角色树上的每个节点移上去会显示一个'三点'icon 符号，然后移上去会显示操作框，里面包含查看、编辑和删除按钮。

#### 新增/编辑角色

新增/编辑角色页面包含以下字段：

|  字段名  |           规则           | 权限 |
| :------: | :----------------------: | :--: |
| 角色名称 | 必填，只能是中文或者英文 |  -   |
| 上级角色 |    必填，只能选择一个    |  -   |
| 选择权限 |            -             |  -   |
|   备注   | 字符不可以超过 200 长度  |  -   |

其中根节点的角色编辑是没有上级角色字段，因为根节点就是顶层节点。

#### 角色管理详情

角色管理详情页面包含字段：角色名称、上级角色、权限选择和备注，权限选择不可以编辑。根节点的角色详情不包括上级角色。

## 机构管理

机构管理用于展示企业的组织结构，方便管理者对部门信息、部门管理者信息等进行统一管理，可对组织机构进行增、删、改、查的管理操作。

#### 新增/编辑机构部门

新增/编辑部门页面包含以下字段：

|   字段名   |                   规则                    | 权限 |
| :--------: | :---------------------------------------: | :--: |
|  部门名称  | 必填，只能是中文或者英文，字符长度最大 20 |  -   |
|  职能描述  |             字符长度最大 200              |  -   |
|  虚拟部门  |                     -                     |  -   |
|  上级部门  |                 可以多选                  |  -   |
| 部门负责人 |                 可以多选                  |  -   |
|  分管领导  |                 可以多选                  |  -   |

#### 机构部门详情

机构部门详情页面包括字段：部门名称、职能描述、虚拟部门、上级部门、部门负责人和分管领导。根节点只有部门名称和职能描述字段，并且不可以删除，即没有删除按钮。

## 菜单管理

菜单管理，主要是对【目录、菜单、按钮】进行动态的新增、修改、删除等操作，方便开发者管理菜单。

#### 新增/编辑/查看目录

新增/编辑/查看目录包含以下字段：

|  字段名  |                     规则                     | 权限 |
| :------: | :------------------------------------------: | :--: |
|   类型   |                      -                       |  -   |
|   名称   |   必填，字符长度最大 50，只能为中文或英文    |  -   |
| 上级目录 | 必填，默认是一级菜单目录（根目录，后台指定） |  -   |
|  排序号  |          整数，不填后台默认指定为 1          |  -   |

#### 新增/编辑/查看菜单

新增/编辑/查看菜单包含以下字段：

|  字段名  |                  规则                   | 权限 |
| :------: | :-------------------------------------: | :--: |
|   类型   |                    -                    |  -   |
|   名称   | 必填，字符长度最大 50，只能为中文或英文 |  -   |
| 上级目录 | 必填，可选目录，目录中不可以出现根目录  |  -   |
| 菜单 URL |        前端路由中`name`字段的值         |  -   |
| 权限标识 |               暂时无意义                |  -   |
|  排序号  |       整数，不填后台默认指定为 1        |  -   |

#### 新增/编辑/查看按钮

新增/编辑/查看菜单包含以下字段：

|  字段名  |                  规则                   |           权限           |
| :------: | :-------------------------------------: | :----------------------: |
|   类型   |                    -                    |            -             |
|   名称   | 必填，字符长度最大 50，只能为中文或英文 |            -             |
| 上级菜单 |             必填，可选菜单              |            -             |
| 权限标识 |          格式：`dsf:user:list`          | 控制在该模块中按钮的显示 |
| 权限类型 |                    -                    |        暂时无意义        |

## 参数管理

用于对系统常用的配置参数进行管理，如微信的配置参数，redis 的配置参数等。

#### 新增/编辑/查看参数

新增/编辑/查看参数包含以下字段：

| 字段名 |                  规则                   | 权限 |
| :----: | :-------------------------------------: | :--: |
| 参数名 | 必填，字符长度最大 50，只能为中文或英文 |  -   |
| 参数值 |         必填，字符长度最大 2000         |  -   |
|  备注  |            字符长度最大 256             |  -   |

## 登录日志

系统跟踪记录所有用户登录系统日志。并提供列表界面直观显示查询。

## 管理组

每个用户都拥有一个唯一的账号，同一个用户可以属于多个管理组，每个管理组对应地拥有一个或多个不同的角色，管理组能够更好地协助系统的权限控制，提高系统的安全性。

#### 新增/编辑/查看管理组

新增/编辑/查看参数包含以下字段：

|   字段名   |                  规则                   | 权限 |
| :--------: | :-------------------------------------: | :--: |
| 管理组名称 | 必填，字符长度最大 32，只能为中文或英文 |  -   |
|    备注    |         必填，字符长度最大 128          |  -   |
|    角色    |                    -                    |  -   |

#### 成员管理

管理组中添加成员管理员，那么该管理员就会拥有管理组中所有角色的权限。

添加成员可以多选。

## 定时任务

使用开源框架 Quartz，实现的定时任务，自带了各数据库的 SQL 脚本，已实现分布式定时任务，可部署多台服务器，不重复执行，以及动态增加、修改、删除、暂停、恢复、立即执行定时任务。

#### 新增/编辑/查看定时任务

新增/编辑/查看定时任务包含以下字段：

|   字段名    |            规则            | 权限 |
| :---------: | :------------------------: | :--: |
|    服务     |             -              |  -   |
|    接口     |             -              |  -   |
|  请求地址   |            必填            |  -   |
|  请求方法   |            必填            |  -   |
| cron 表达式 | 必填，格式 0 _/1 _ \* \* ? |  -   |
|  请求参数   |   必填，字符长度最大 128   |  -   |
|    备注     |   必填，字符长度最大 128   |  -   |

## 消息日志

## 操作日志

系统跟踪记录所有用户操作系统的过程，提供回溯。包括新增、修改、删除、查询、传输等。所有的操作均需由系统自动在日志中记录，生成的日志不可修改。 同时需要记录系统用户对数据的操作历史，包括：操作数据（所属库、表、是否具有权限）、操作账号、操作行为类型（查询、读取、写入等）、操作行为合法性、操作时间、访问端 IP 等信息。

## 上传文件

图片、文件上传，使用的是七牛、阿里云、腾讯云的存储服务，不能上传到本地服务器，有上传到本地服务器，不利于维护，访问速度慢等缺点，所以使用云存储服务。

## 字典管理

字典用于存储一些系统常用的关键字和条目对，在视图中需要使用这些关键字和条目时则可从字典中引用，字典管理就对这些关键和条目进行统一管理，实现对字典的增加、修改、删除等。

#### 新增/编辑/查看字典

新增/编辑/查看字典包含以下字段：

| 字段名 |         规则          | 权限 |
| :----: | :-------------------: | :--: |
|  名称  | 必填，字符长度最大 50 |  -   |
|  代码  | 必填，字符长度最大 32 |  -   |
| 排序号 |    字符长度最大 2     |  -   |
|  备注  |   字符长度最大 200    |  -   |

搜索框旁的新增按钮是新增字典类，搜索框只提供字典类代码的查询。

## 定时任务日志
