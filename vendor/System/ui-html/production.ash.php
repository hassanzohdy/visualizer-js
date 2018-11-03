<!DOCTYPE html>
<html dir="{{ $direction }}" app="{{ $appName }}" lang="{{ $localeCode }}">

<head>
    <base href="{{ $basePath }}/" />
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <title>{{$title}}</title>
    <meta name="keywords" content="" />
    <meta name="description" content="">
    <!-- Favicon -->
    <link rel="shortcut icon" href="{{ $favicon }}">
    <meta name="fragment" content="!">
    @foreach ($stylesheets as $stylesheet)
    <link rel="stylesheet" {{ strpos($stylesheet, 'app') !== false ? 'id="app-style"' : '' }} href="{{ $stylesheet }}" />
    @endforeach
</head>

<body>
    <!-- Script Initializer => si -->
    <script id="si">
        function es6() {
            "use strict"; if (typeof Symbol == "undefined") return false;
            try {
                eval("class Foo {}");
                eval("var bar = (x) => x+1");
            } catch (e) { return false; }

            return true;
        }
        
        function loadScripts(index) {
            var e = document.createElement('script');
            e.src = scripts[index];
            document.body.appendChild(e);

            if (index + 1 < scripts.length) {
                e.onload = function () {
                    loadScripts(index + 1);
                }
            } else {
                var si = document.getElementById('si');

                si.parentNode.removeChild(si);
            }
        }

        if (! es6()) {
            var scripts = JSON.parse('{{ json_encode($scripts['es5'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) }}');
            window.onload = function () {
                loadScripts(0);
            };
        } else {
            var si = document.getElementById('si');
            si.parentNode.removeChild(si);
        }
    </script>
    @foreach ($scripts['es6'] as $script)
        <script src="{{ $script }}"></script>
    @endforeach
</body>

</html>