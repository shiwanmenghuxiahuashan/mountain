# ssl

免费 https://letsencrypt.org/zh-cn/getting-started/
cerbot https://eff-certbot.readthedocs.io/en/latest/intro.html

```bash
sudo certbot --nginx --nginx-server-root /www/server/nginx/conf
```

# 申请证书

```bash
Which names would you like to activate HTTPS for? 
您想为哪些名称激活 HTTPS？

We recommend selecting either all domains, or all domains in a VirtualHost/server block. 
我们建议选择所有域或 VirtualHost/服务器块中的所有域

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1: yourDomain.com
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Select the appropriate numbers separated by commas and/or spaces, or leave input  选择以逗号和/或空格分隔的适当数字，或保留输入内容

blank to select all options shown (Enter 'c' to cancel): 1 空白以选择显示的所有选项（输入“c”以取消）：1

Requesting a certificate for yourDomain.com 为 yourDomain.com 请求证书

```

```bash
Certbot failed to authenticate some domains (authenticator: nginx). Certbot 无法验证某些域（验证器：nginx）

 The Certificate Authority reported these problems: 证书颁发机构报告了这些问题:
  Domain: yourDomain.com
  Type:   dns
  Detail: no valid A records found for yourDomain.com; no valid AAAA records found for yourDomain.com

Hint: The Certificate Authority failed to verify the temporary nginx configuration changes made by Certbot. Ensure the listed domains point to this nginx server and that it is accessible from the internet. 证书颁发机构无法验证 Certbot 所做的临时 nginx 配置更改。确保列出的域指向此 nginx 服务器并且可以从 Internet 访问它。

Some challenges have failed.
Ask for help or search for solutions at https://community.letsencrypt.org. See the logfile /var/log/letsencrypt/letsencrypt.log or re-run Certbot with -v for more details.
```

# 检查域名

```bash
dig yourDomain.com
```
