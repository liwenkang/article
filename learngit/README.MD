来自 廖雪峰的博客http://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000/0013743256916071d599b3aed534aaab22a0db6c4e07fd0000
2017年7月2日13:42:05

一、起步

初始化一个Git仓库，使用git init命令。

添加文件到Git仓库，分两步：

第一步，使用命令git add <file>，注意，可反复多次使用，添加多个文件；

第二步，使用命令git commit，完成。（git commit -m "修改的描述"）

二、查看不同

要随时掌握工作区的状态（文件是否被修改，文件是否被添加到缓存区），使用git status命令。

如果git status告诉你有文件被修改过，用git diff可以查看修改内容。

三、进行版本控制

HEAD指向的版本就是当前版本，因此，Git允许我们在版本的历史之间穿梭，使用命令git reset --hard commit_id。

$ git reset --hard HEAD^（回到上一个版本）

$ git reset --hard HEAD~1(回到上一个版本）

穿梭前，用git log可以查看提交历史，以便确定要回退到哪个版本。

要重返未来，用git reflog查看命令历史，以便确定要回到未来的哪个版本。


四、git如何添加一个文件

把文件往Git版本库里添加的时候，是分两步执行的：

第一步是用git add把文件添加进去，实际上就是把文件修改添加到暂存区；

第二步是用git commit提交更改，实际上就是把暂存区的所有内容（add后的所有内容）提交到当前分支。

五、撤销自己的更改

场景1：当你改乱了工作区某个文件的内容，想直接丢弃工作区的修改时，用命令git checkout -- file。

场景2：当你不但改乱了工作区某个文件的内容，还添加到了暂存区时，想丢弃修改，分两步，第一步用命令git reset HEAD file，就回到了场景1，第二步按场景1操作。

场景3：已经提交了不合适的修改到版本库时，想要撤销本次提交，参考版本回退一节，不过前提是没有推送到远程库。

六、删除一个文件

rm film后

选项1：彻底删除它 git rm

选项2：反悔了，撤销删除这一步 git chekout -- film

命令git rm用于删除一个文件。如果一个文件已经被提交到版本库，那么你永远不用担心误删，但是要小心，你只能恢复文件到最新版本，你会丢失最近一次提交后你修改的内容。

七、将本地的代码关联github的一个仓库后，直接git push origin master即可实现上传代码

要关联一个远程库，使用命令git remote add origin git@server-name:path/repo-name.git；

关联后，使用命令git push -u origin master第一次推送master分支的所有内容；

此后，每次本地提交后，只要有必要，就可以使用命令git push origin master推送最新修改；

分布式版本系统的最大好处之一是在本地工作完全不需要考虑远程库的存在，也就是有没有联网都可以正常工作，而SVN在没有联网的时候是拒绝干活的！当有网络的时候，再把本地提交推送一下就完成了同步，真是太方便了！

八、从github上克隆一个仓库到本地

$ git clone https://github.com/liwenkang/IFE-web

要克隆一个仓库，首先必须知道仓库的地址，然后使用git clone命令克隆。

Git支持多种协议，包括https，但通过ssh支持的原生git协议速度最快。

九、分支相关

vi test.txt 进入编辑模式  :wq 保存并退出

Git鼓励大量使用分支：

查看分支：git branch

创建分支：git branch <name>

切换分支：git checkout <name>

创建+切换分支：git checkout -b <name>  创建并且切换

合并某分支到当前分支：git merge <name>

删除分支：git branch -d <name>

十、当快速合并出现问题时，如何解决？

当出现无法自动合并的情况时，git status查看什么文件出现了冲突

然后进入vi编辑模式，对其进行人工改正

最后$ git log --graph --pretty=oneline --abbrev-commit 可以看到分支的合并情况（不显示作者，和版本号）

当Git无法自动合并分支时，就必须首先解决冲突。解决冲突后，再提交，合并完成。

用git log --graph命令可以看到分支合并图。

十一、对于开发过程中每一步都需要保存的情况，建议使用普通模式合并。

分支策略：

在实际开发中，我们应该按照几个基本原则进行分支管理：

首先，master分支应该是非常稳定的，也就是仅用来发布新版本，平时不能在上面干活；

那在哪干活呢？干活都在dev分支上，也就是说，dev分支是不稳定的，到某个时候，比如1.0版本发布时，再把dev分支合并到master上，在master分支发布1.0版本；

你和你的小伙伴们每个人都在dev分支上干活，每个人都有自己的分支，时不时地往dev分支上合并就可以了。

合并分支时，加上--no-ff参数就可以用普通模式合并，合并后的历史有分支，能看出来曾经做过合并，而fast forward合并就看不出来曾经做过合并。

$ git merge --no-ff -m "merge with no-ff" dev

十二、紧急修复bug时，需要临时保存

修复bug时，我们会通过创建新的bug分支进行修复，然后合并，最后删除；

当手头工作没有完成时，先把工作现场git stash一下，然后去修复bug（通过创建新的分支，修改完成后，合并到master中），修复后，再git stash pop，回到工作现场。

多次使用临时存储 git stash 时，可以用 $ git stash apply stash@{0} 准确恢复到某次的工作状态。

十三、强行删除分支

如果你在分支上把某一个小功能呢刚开发完毕，准备合并到master上面时，boss说，功能取消。。。那我就直接 git branch -D 分支名称 ，把分支强行删除。 （注意，此时，没有后悔药可以吃了）

十四、多人协作

多人协作的工作模式通常是这样：

首先，可以试图用git push origin branch-name推送自己的修改；

如果推送失败，则因为远程分支比你的本地更新，需要先用git pull试图合并；

如果合并有冲突，则解决冲突，并在本地提交；

没有冲突或者解决掉冲突后，再用git push origin branch-name推送就能成功！

如果git pull提示“no tracking information”，则说明本地分支和远程分支的链接关系没有创建，用命令git branch --set-upstream branch-name origin/branch-name。

这就是多人协作的工作模式，一旦熟悉了，就非常简单。

查看远程库信息，使用git remote -v；

本地新建的分支如果不推送到远程，对其他人就是不可见的；

从本地推送分支，使用git push origin branch-name，如果推送失败，先用git pull抓取远程的新提交；

在本地创建和远程分支对应的分支，使用git checkout -b branch-name origin/branch-name，本地和远程分支的名称最好一致；

建立本地分支和远程分支的关联，使用git branch --set-upstream branch-name origin/branch-name；

从远程抓取分支，使用git pull，如果有冲突，要先处理冲突。

十五、

命令git tag <name>用于新建一个标签，默认为HEAD，也可以指定一个commit id；

git tag -a <tagname> -m "blablabla..."可以指定标签信息；

git tag -s <tagname> -m "blablabla..."可以用PGP签名标签；

命令git tag可以查看所有标签。

标签和commit相互关联

"用户 ID"的 Hash 字符串，可以用来替代"用户 ID"。  81A221C0

pub   2048R/81A221C0 2017-07-04  公钥文件名

uid    liwenkang <changzhiliwenkang@outlook.com>  显示公钥特征

sub   2048R/2C7F9690 2017-07-04  第三行显示"用户 ID"，第四行显示私钥特征。


此处问题没有解决哦

十六、

命令git push origin <tagname>可以推送一个本地标签；

命令git push origin --tags可以推送全部未推送过的本地标签；

命令git tag -d <tagname>可以删除一个本地标签；

命令git push origin :refs/tags/<tagname>可以删除一个远程标签。

十七、

在GitHub上，可以任意Fork开源仓库；

自己拥有Fork后的仓库的读写权限；

可以推送pull request给官方仓库来贡献代码。

十八、

如果你希望，你的文件夹中不出现某些不重要的文件，你可以把它们写到.gitignore文件中，上传到git里面，这样，git再上传时就不会上传这些文件

忽略某些文件时，需要编写.gitignore；

git add -f xx.txt 从而强制加入这个文件

git check-ignore 可以看出是哪个规则导致无法加入

.gitignore文件本身要放到版本库里，并且可以对.gitignore做版本管理！

十九、配置别名

$ git config --global alias.st status  将status 等价于 st 

global 表示的是全局都换












