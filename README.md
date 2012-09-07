注1：本 Firefox 插件是给 [麦库记事](https://developer.mozilla.org/en-US/docs/XUL_School/Setting_Up_a_Development_Environment) 网站开发的网页剪辑器工具。

注2：本文只介绍 Firefox 插件开发环境的搭建。

# Firefox 插件开发环境搭建 #

方便的 IDE 和 Debug 工具是程序开发的基本需求，也是程序开发者必须要掌握的技能， Firefox 插件开发也不另外。

开发插件前，有一篇官方的文档是必须要仔细看的：

> [Setting Up a Development Environment](https://developer.mozilla.org/en-US/docs/XUL_School/Setting_Up_a_Development_Environment)

这篇文章已经很详细地介绍了插件开发环境的搭建，我也是照着这篇文档进行配置的，并建议大家都按此文档介绍的方法来做。

## Firefox 插件开发的一般步骤 ##

一般地，插件开发的过程是这样的：

1. 编写代码
2. 把代码及资源文件整个打包成 ***.zip*** 文件
3. 把 ***.zip*** 更改为 ***.xpi***
4. 把 ***.xpi*** 文件拷贝到 ***Firefox*** 的插件安装目录
5. 重启 ***Firefox*** 浏览器，插件生效

一般地，需要上面的 **5** 个步骤，才能验证一次普通的代码修改。这几乎是不可能做到的，官方的这篇文档也已经考虑到这是一个不可能的任务，所以介绍了方便开发的工具。

## Firefox 插件开发官方建议方法 ##
以下我只讲解在**windows**下面开发的部分。

1. 安装 [Komodo Edit](http://www.activestate.com/komodo_edit/) 
2. 安装 [make](http://www.gnu.org/software/make/) 和 [cygwin](http://www.cygwin.com/) 工具，安装完后在系统环境变量添加相应路径
3. 下载官方的例子  [Hello World 2 Project.](https://developer.mozilla.org/@api/deki/files/5142/=HelloWorld2.zip)
4. 打开 ***src*** 目录下面的 ***HelloWorld2.komodoproject*** 文件
5. 打开 ***Makefile*** 里面的 ***profile_dir***，改成本机上 Firefox 的 profile 目录路径，并检查 ***profile_location*** 是否正确
6. 分别运行 ***make*** 和 ***bash -c "export OSTYPE; make install" ***命令
7. 重启 Firefox 浏览器。至此，恭喜你，插件终于"上线运行"了

接下来的每次代码修改，你都需要运行两条命令（即步骤 **6**），然后手动重启浏览器（步骤 **7**）。**我敢保证，如果你就这么老实地按照这个步骤来做，你坚持不了两天，因为你的手会酸得不行**。

## Firefox 插件开发民间补充方法 ##

我至今不明白为什么官方的文档只介绍到这就不再介绍更加方便的方法了。那有没有更加简单的方法呢？答案是肯定的。我为此也不惜花费了将近一整天的时间来研究简化开发的过程。

1. 首先合并两条命令：将 ***make install*** 的命令拷贝到 ***make*** 下面
2. 添加语句：taskkill /f /im firefox.exe /fi "STATUS eq RUNNING" //如果有 Firefox 的进程，则杀死该进程
3. 添加语句：sleep 1 //防止接下来的启动 Firefox 的过程太快，导致进程还未真正被杀死
4. 添加语句：firefox.exe -jsconsole //启动进程，后面跟的命令参数是让 Firefox 启动时就打开 console 对话框，方便查看调试信息


注：需要在系统环境变量里面添加 Firefox 的安装路径。

添加了上面的语句后，现在只要运行一条命令，就能自己安装插件（其实完成本文刚开始说的 ***5*** 个步骤），然后 Firefox 浏览器也会自动重启，是不是觉得方便很多啦！

最后你可以再录制一个宏（我也建议你这么做） ***（Macro）***，绑定一个运行的快捷键，比如 **F5**，这样你就能修改代码后，按一下 **F5** 就行了，其它一切的工作，都会自动完成，大大地加快了开发进度。

注：以上说的所有过程，可以直接参考本 ***repo*** 中的 ***Makefile*** 文件






