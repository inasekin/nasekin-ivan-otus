# Event loop nodejs

`npm run tree -- foo/`
`npm run tree -- foo2/`

Напишите NodeJS скрипт tree для вывода списка файлов и папок файловой системы.
Результатом работы должен быть объект с массивами { files, folders }.
Вызовы файловой системы должны быть асинхронными.
Скрипт принимает входной параметр - путь до папки.
Добавить возможность выполнять этот скрипт через команду npm run tree -- path
Пример

<pre>
foo/
├── bar/
│├── bar1.txt
│├── bar2.txt
│└── baz/
├── f1.txt
└── f2.txt

При вызове с путем foo/ скрипт должен вернуть структуру:

{
"files": [
"foo/f1.txt",
"foo/f2.txt",
"foo/bar/bar1.txt",
"foo/bar/bar2.txt"
],
"dirs": [
"foo",
"foo/bar",
"foo/bar/baz"
]
}
</pre>
