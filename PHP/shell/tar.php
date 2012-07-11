<?php
/**
 * If you need to tar / untar a file with no shell access.
 * Will not work when exec is blocked for php
 * Delete after use and ABSOLUTELY NO GET/POST INPUT!
 *
 * @author    Florian Rachor <f.rachor@websafari.eu>
 */

// Filename of the tar.gz archive
$fileName = '';

// For tar, directory that will be packed
$directory = '';

// Just empty if you want to tar something
$cmd = 'untar';

if ($cmd == 'untar') {
    $shellCmd = 'tar -xzvf ' . $fileName;
} else $shellCmd = 'tar -cfvz ' . $fileName . ' ' . $directory;

$shellCmd = escapeshellcmd($shellCmd);
exec($shellCmd, $res);

// Uncomment if you want verbose output
//print_r($res);