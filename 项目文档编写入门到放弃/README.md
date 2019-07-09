## 页面设计文档入门到放弃

参考资料

[Word2016设置多级列表](https://blog.csdn.net/PYTandFA/article/details/80299175)

[排版字体设置](https://www.zhihu.com/question/26898769)

[在插入图片的时候,附带上图片名称](http://www.cnblogs.com/aozima/p/5515116.html)

```
​```
Sub InsertPic()
    Dim myfile As FileDialog
    Set myfile = Application.FileDialog(msoFileDialogFilePicker)
    With myfile
        .InitialFileName = "F:\"
        If .Show = -1 Then
            For Each fn In .SelectedItems
 
                Set mypic = Selection.InlineShapes.AddPicture(FileName:=fn, SaveWithDocument:=True)
                '按比例调整相片尺寸
                WidthNum = mypic.Width
                c = 10         '在此处修改相片宽,单位厘米
                mypic.Width = c * 28.35
                mypic.Height = (c * 28.35 / WidthNum) * mypic.Height
                If Selection.Start = ActiveDocument.Content.End - 1 Then  '如光标在文末
                    Selection.TypeParagraph    '在文末添加一空段
                Else
                    Selection.MoveDown
                End If
                Selection.Text = Basename(fn)    '函数取得文件名
                Selection.EndKey
 
                If Selection.Start = ActiveDocument.Content.End - 1 Then  '如光标在文末
                    Selection.TypeParagraph    '在文末添加一空段
                Else
                    Selection.MoveDown
                End If
            Next fn
        Else
        End If
    End With
    Set myfile = Nothing
End Sub
 
Function Basename(FullPath)    '取得文件名
    Dim x, y
    Dim tmpstring
    tmpstring = FullPath
    x = Len(FullPath)
    For y = x To 1 Step -1
        If Mid(FullPath, y, 1) = "\" Or _
           Mid(FullPath, y, 1) = ":" Or _
           Mid(FullPath, y, 1) = "/" Then
            tmpstring = Mid(FullPath, y + 1)
            Exit For
        End If
    Next
    Basename = Left(tmpstring, Len(tmpstring) - 4)
End Function
​```
```

前端的设计文档应该包含

页面布局介绍

页面功能介绍