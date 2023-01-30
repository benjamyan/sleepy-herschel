
# sleepy-herschel(PART 2)
Here is a codesandbox that is a small app with a rendering issue:
https://codesandbox.io/s/zealous-snowflake-h3roxv

The state in this app includes two types of entities, normalized with createEntityAdapter: ItemGroups,
and Items. ItemGroups consist of Items as well as a "computation type" which determines how certain
UI is displayed.

In the app UI, each ItemGroup includes a select/dropdown to change its computation type, a dummy
text field (whose value is NOT involved in the ItemGroup's computation), and a "derived value" that
uses the computation type and the list of Items to display some value.
The computation types are:
1. Normal: Show the contained Items as a comma-separated list.
2. Sorted A-Z: Same list, but sorted alphabetically.
3. Special: Ignore the Items in this ItemGroup—simply display the ID of the largest ItemGroup
(i.e., the one with the most Items in it, with ties broken by ItemGroup order)

If you interact with the app (adding ItemGroups, adding Items to ItemGroups, changing computation
type, entering dummy text), everything should "work", but there is an issue with efficiency: the
computation function is called in every render! We're pretending that the computation function is a lot
more expensive than it actually is in this example, so your task is to avoid this unnecessary re-
computation except when it actually NEEDS to recompute.

## To be considered correct, these criteria must be met:
1. When the computation is evaluated, it will log to the console. When you change the
computation type, you should get exactly one log.
2. When you enter text into the dummy input fields, you should not get any logs.
3. When you click Add Item, you should get exactly one log, UNLESS you add enough Items
such that there is a new "biggest" ItemGroup ("biggest" means that it has the most Items; ties
are broken by the order of ItemGroups)
4. The logic should still largely be in the same place as it already is: please do not move any of
the computation into the ItemGroup component. There should be exactly 2 calls to
useSelector in ItemGroup and no additional useRef or useState calls.
5. Please limit yourself to using React APIs and @reduxjs/toolkit APIs (and utilities re-
exported with @reduxjs/toolkit). In other words, everything you need should be in the sandbox
already without installing any dependencies!