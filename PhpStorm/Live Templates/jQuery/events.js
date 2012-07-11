// Event like click with single function
$($ELEMENT$).$EVENT$(function (e) {
    e.preventDefault();

    $END$
});

// Event like hover with two functions
$($ELEMENT$).$EVENT$(function (e) {
        e.preventDefault();

        $END$
    }, function (e) {
        e.preventDefault();

    }
);