<?php
/**
 * Use this file to add symlinks without shell access.
 * Will not work when exec is blocked for php
 * Delete after use and ABSOLUTELY NO GET/POST INPUT!
 *
 * @author    Florian Rachor <f.rachor@websafari.eu>
 */

$linkName = '';
$linkTarget = '';

$return = symlink($linkTarget, $linkName);

if ($return) echo "Your link was successfully created";
else echo "I'm really sorry, something has gone wrong";