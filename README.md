# patch-hbuilderx-plugins

## Init

1. install deps

```
yarn init
```

2. create .env

```
HBUILDERX_PLUGINS_DIR="..."
HBUILDERX_PLUGINS_PATCHES_DIR="..."
```

## Making patches

```
yarn make --plugin %Plugin Name% %Package Names%
```

## Publish Patches

> repo: https://github.com/zhetengbiji/hbuilderx-plugins-patches

## Applying Patches

* Developer

```
yarn patch %HBuilderX Path%
```

* User

```
npx patch-hbuilderx-plugins %HBuilderX Path%
```
