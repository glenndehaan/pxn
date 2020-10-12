# PXN (Plex XMLTV Netherlands)

A plex compatible XMLTV generator for The Netherlands

## Structure
- NodeJS
- Commander
- XMLBuilder2

## Basic Usage
- Download the latest version from the releases page on GitHub
- Save the binary in its own folder
- Run the binary `./pxn-xxx` (this will create some additional files)
- Start indexing channels `./pxn-xxx channels`
- List the channels you just indexed `./pxn-xxx list`
- Change your config to include the channels you want to grab `config.json`
- Check if your channels are now marked for indexing `./pxn-xxx list`
- Start grabbing show information and create a XMLTV file `./pxn-xxx run`
- Automate the run process to create up-to-date XMLTV files for plex

## Development Usage
- Install NodeJS 8.0 or higher
- Run `npm install` in the root project folder
- Run `npm start [args]` in the root project folder

## Channel Database
When grabbing channels we create a local database that will be used during indexing.
Missing channels? Just run `./pxn-xxx channels` again.

Checkout `.pxn-channels` since this is the database file.

## config.json Explanation
```
{
  "channels": [ <<- This block is used to define the channels you want to index. (This only contains channels numbers)
    1
  ]
}
```

## Help
```
Usage: pxn [options] [command]

Options:
  -h, --help      display help for command

Commands:
  run             grabs the epg data and stores it into an XMLTV format
  channels        grabs the epg channels and stores it into a JSON format
  list            lists the available channels and marks the channels configured for epg grabbing
  help [command]  display help for command
```

## License

MIT
