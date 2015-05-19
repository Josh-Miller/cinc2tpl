# CINC 2 Tpl

Auto create field aware Drupal node.tpl files from [CINC Display](https://www.drupal.org/project/cinc_display) yaml files.

This is part of the [CINC](https://www.drupal.org/project/cinc) workflow built @ [Aten Design Group](http://atendesigngroup.com/)

## Getting started

Install globally via npm `npm i cinc2tpl -g`

Go to your root Drupal directory and run `cinc2tpl`

## Options

* -f, --force                       Force file override
* -d, --destination [value]         Template file destination

## How it works

This will scan your entire Drupal directory for cinc_display.node files and grab the visible fields. It will then compare the field names with the field settings file to create field aware markup for fields in the tpl file.

For example. If you have an image field it will wrap it with a `<figure>` tag instead of a `<div>`

It will create these files in the root of your directory, which you can then copy to the appropriate theme folder.

## Backlog
- Create flags for more options and params
- Create compatability with other entity types
- Better documentation
