#  免费 SSL 证书安装

免费 https://letsencrypt.org/zh-cn/getting-started/

## cerbot

安装向导：https://certbot.eff.org/

doc: https://eff-certbot.readthedocs.io/en/latest/intro.html

## 1. 安装 `snap (包管理器)`

这个命令安装snapd，使你能够在你的系统上使用Snap包

```shell
  # 基于  RHEL 环境命令
  # sudo:以超级用户权限运行命令，因为安装软件包通常需要管理员权限。
  # dnf:基于RPM的Linux发行版中的包管理工具，用于安装、更新和删除软件包。 RPM 是最古老的传统软件包管理器之一，它是为基于Red Hat 的系统设计的
  # install:是DNF的一个命令，用于安装新的软件包。 (npm install 也是类似的命令)
  # snapd:是要安装的软件包的名称，它是Snap包管理器的守护进程

  sudo dnf install snapd
```

然后创建符号链接 (功能类似于windows的快捷方式 或 环境变量)

```shell
  # 创建符号链接  然后重启服务器
  sudo ln -s /var/lib/snapd/snap /snap
```

## 2. 安装运行 certbot

certbot 将自动安装SSL证书，并通过 snapd 守护程序自动更新证书。

```shell
  # 安装 certbot
  sudo snap install --classic certbot
```

### 命令行提示步骤

```shell
  # 运行 certbot 自动创建 ssl 证书
  # /www/server/nginx/conf nginx 配置文件目录
  sudo certbot --nginx --nginx-server-root /www/server/nginx/conf
```

运行上述命令后出现如下提示：

```shell
# 您想为哪些名称激活 HTTPS？
Which names would you like to activate HTTPS for? 

# 我们建议选择所有域名，或者 VirtualHost/server 块中的所有域名。
We recommend selecting either all domains, or all domains in a VirtualHost/server block. 

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1: yourDomain.com
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

# 选择适当的数字并用逗号和/或空格分隔，或将输入留空以选择显示的所有选项（输入“c”取消）
Select the appropriate numbers separated by commas and/or spaces, or leave input blank to select all options shown (Enter 'c' to cancel): 

# 为 yourDomain.com 申请证书
Requesting a certificate for yourDomain.com 
```

### 证书创建失败

```shell
# Certbot 无法验证某些域名（验证器：nginx）
Certbot failed to authenticate some domains (authenticator: nginx).

# 证书颁发机构报告了这些问题：
 The Certificate Authority reported these problems:
  Domain: yourDomain.com
  Type:   dns
  # 详情:未找到 yourDomain.com 的有效 A 记录；未找到 yourDomain.com 的有效 AAAA 记录
  Detail: no valid A records found for yourDomain.com; no valid AAAA records found for yourDomain.com

# 提示：证书颁发机构无法验证 Certbot 所做的临时 nginx 配置更改。请确保列出的域指向此 nginx 服务器，并且可以从互联网访问它。
Hint: The Certificate Authority failed to verify the temporary nginx configuration changes made by Certbot. Ensure the listed domains point to this nginx server and that it is accessible from the internet.

# 一些挑战失败了。
Some challenges have failed.
# 请在 https://community.letsencrypt.org 上寻求帮助或搜索解决方案。
Ask for help or search for solutions at https://community.letsencrypt.org. 

# 请参阅日志文件 /var/log/letsencrypt/letsencrypt.log 或使用 -v 重新运行 Certbot 以了解更多详细信息。
See the logfile /var/log/letsencrypt/letsencrypt.log or re-run Certbot with -v for more details.
```

### 检查域名解析

上方错误提示中提到了 `no valid A records found for yourDomain.com; no valid AAAA records found for yourDomain.com` ，这是因为域名解析失败，没有找到域名对应的 IP 地址。

可以通过如下命令进行检查解析记录 A

```shell
  dig yourDomain.com A
```

如果你收到了“dig: command not found”的错误，这意味着dig命令在你的系统上未安装。

dig是一个强大的DNS查询工具，通常包含在bind-utils（在RedHat/CentOS系统上）或dnsutils（在Debian/Ubuntu系统上）包中。

你可以根据你的操作系统使用下面的命令来安装它：

```shell
  # 对于Debian/Ubuntu系统：
  sudo apt-get update
  sudo apt-get install dnsutils
```

或

```shell
  # 对于RedHat/CentOS系统
  sudo yum update
  sudo yum install bind-utils
```

安装完成后，你应该能够使用dig命令。再次运行你的dig命令，它现在应该能正常工作了。

### 检查域名解析示例

```shell
dig baidu.com
```

输出如下：
  

```shell
# 第一部分 显示 dig 命令的版本和输入的参数。
; <<>> DiG 9.11.36-RedHat-9.11.36-14.0.1.al8 <<>> baidu.com
;; global options: +cmd

# 第二部分 显示服务返回的一些技术详情，比较重要的是 status。如果 status 的值为 NOERROR (谋闷题) 则说明本次查询成功结束。
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 42828
;; flags: qr rd ra; QUERY: 1, ANSWER: 2, AUTHORITY: 0, ADDITIONAL: 0

# 第三部分中的 "QUESTION SECTION" 显示我们要查询的域名。
;; QUESTION SECTION:
; baidu.com.			IN	A

# 第四部分的 "ANSWER SECTION" 是查询到的结果。
;; ANSWER SECTION:
baidu.com.		9	IN	A	39.156.66.10
baidu.com.		9	IN	A	110.242.68.66

# 第五部分则是本次查询的一些统计信息，比如用了多长时间，查询了哪个 DNS 服务器，在什么时间进行的查询等等。
;; Query time: 0 msec
;; SERVER: 100.100.2.136#53(100.100.2.136)
;; WHEN: Fri Jul 05 13:58:42 CST 2024
;; MSG SIZE  rcvd: 59
```

## 安装成功

```shell
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/yourDomain.com/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/yourDomain.com/privkey.pem
This certificate expires on 2024-10-03.
These files will be updated when the certificate renews.
Certbot has set up a scheduled task to automatically renew this certificate in the background.

Deploying certificate
Successfully deployed certificate for yourDomain.com to /www/server/nginx/conf/nginx.conf
Congratulations! You have successfully enabled HTTPS on https://yourDomain.com

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
If you like Certbot, please consider supporting our work by:
 * Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
 * Donating to EFF:                    https://eff.org/donate-le
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

```

# 参考资料

[YUM 和 RPM 包管理器的不同之处](https://linux.cn/article-12170-1.html)

[linux dig 命令](https://www.cnblogs.com/sparkdev/p/7777871.html)
