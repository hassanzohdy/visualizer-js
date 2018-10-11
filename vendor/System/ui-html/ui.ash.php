<!DOCTYPE html>
<html dir="{{ clang()->direction}}" app="{{ $appName }}" lang="{{ clang()->code }}">
    <head>
        <base href="{{ rtrim(app()->request->scriptPath(), '/') }}/" />
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
        <title>{{$title}}</title>
        <meta name="keywords" content="" />
        <meta name="description" content="">
        <!-- Favicon -->
        <link rel="shortcut icon" href="{{ $fav_icon = assets('favicon.png') }}">
        <meta name="fragment" content="!">
        {{ $stylesheets }}
    </head>
    <body>
    {{ $scripts }}
</body>
</html>
