# isync

> A straightforward, zero-dependency [NodeJS](https://nodejs.org/) module to set JavaScript objects to be automatically persisted to disk, in [JSON](http://www.json.org/), at intervals.

<hr />

[![npm version](https://badge.fury.io/js/isync.svg)](https://badge.fury.io/js/isync)

Released under the terms of the [Beerware](https://fedoraproject.org/wiki/Licensing/Beerware) license.

Contact me on [Telegram](https://telegram.org/) at [@snarkie](https://t.me/snarkie).

## Installation

`npm install isync --save`

## Usage

1. Load isync.
    
    ```javascript
    const isync = require('isync')
    ```
    
2. Create an instance of isync. (If the file already exists, isync will attempt to synchronously parse it as JSON to the `data` property.)
    
    ```javascript
    const store = new isync('./store.json')
    ```
    
3. (a) Use the `data` property as a plain-jane JavaScript object.
    
    ```javascript
    store.data.x = "foo"
    store.data.y = [3, "bar", false]
    store.data.z = { baz: store.data.x + "d", _: [null] }
    ```
    
3. (b) Alternatively, set it to an existing object you want to persist.
    
    ```javascript
    const blob = { pi: 22 / 7, e: [2, 7, 1, 8] }
    store.data = blob
    ```
    
4. The `data` object will be automatically synced at the specified interval (defaults to 10 minutes if unspecified) while your NodeJS program is running.
    
    
5. Before exiting, flush any last-minute changes manually using `flushSync()`.
    
    ```javascript
    store.flushSync()
    ```

## Details

1. An instance of isync is initialised with this constructor signature.

```javascript
new isync(path: String, period?: Number)
``` 

> The period is specified in minutes and optional (defaults to 10 minutes).

<hr />

2. Instances expose the following properties.

```javascript
path
``` 

> File path which this isync instance saves the `data` object to. Change it by assigning a new file path to this property.

```javascript
data
``` 

> A regular JavaScript object, which is serialised as [JSON](http://www.json.org/) and synced to the file path specified. Properties which aren't JSON-serialisable won't be saved to disk.

```javascript
period
``` 

> The interval in minutes at which to flush the `data` object to disk. Change this interval by setting this property; its value will be used from the next sync onwards.

<hr />

3. Instances expose the following methods.

```javascript
unlink()
``` 

> Stops syncing the `data` object to disk at intervals. You can still use it as you would, but changes since the last sync won't be saved automatically.

```javascript
link()
``` 

> Restarts syncing the `data` object, after a call to `unlink()`. (You don't need to call this if you haven't unlinked the instance; by default, newly initialised instances of isync will be syncing automatically.)

```javascript
flushSync()
``` 

> Force a synchronous (thread blocking) flush of the `data` object to disk, even if the instance is unlinked. It is necessary to call this before your NodeJS application exits, unless you're absolutely sure there have been no changes to `data` since the last sync.

```javascript
flush(link: Boolean)
``` 

> An asynchronous (non-blocking) call to save the `data` object to disk, even if the instance is unlinked. If the `link` parameter is set, calls `link()` on this instance after completion.
> 
> Bear in mind that you can't await this call; however, you can listen on the next `'flush'` event after making this call to proceed whenever the flush is completed.

<hr />

4. You can listen on `'flush'` events on an isync instance (`store` in this example) using idiomatic [NodeJS events](https://nodejs.org/api/events.html).

```javascript
store.on('flush', callback)
```

> This event is emitted on completion of both manual and automatic syncs. You can use it to confirm that data has been saved to disk successfully or to log disk syncs.

<hr />

❤️ &nbsp; June, 2017 &nbsp;–&nbsp; October, 2017.
