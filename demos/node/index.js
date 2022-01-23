import { fileURLToPath } from 'url';
import { dirname } from 'path';

import ATMF from '../../src/atmf/node/atmf.js'
// ATMF is now global
// global.ATMF -> The ATMF engine
// global.ATMFEngine -> The class


/** ****************************** **/
/**       Setup AutoDiscovery      **/
/** ****************************** **/
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

ATMF.SetTemplateDiscoveryPath(__dirname + '/../common/templates', ['html']);
ATMF.SetCultureDiscoveryPath(__dirname + '/../common/culture');
ATMF.SetCulture('en-US');
/** ***************************** **/


/** ****************************** **/
/** Using the global selector __() **/
/** ****************************** **/

// Assign variables
__('$fullname', 'Advanced-Template-Markup-Format');
__('$shortname', 'ATMF');
__('$pagetitle', '{$fullname " (" $shortname ")"}');
__('$slogan', 'Cultural made easy!');
__('$userData', __escape('{$crossScripting}'));

// Read variables and translations

__('$fullname'); //Output: Advanced Template Markup Format
__('$pagetitle'); //Output: $fullname ($shortname)
__('@page.theFox 12 red'); //Output: The red fox made 12 steps

/** ******************************* **/

/** ************************* **/
/** Using JS native functions **/
/** ************************* **/

ATMF.vars['slogan'] = 'Cultural made easy!';
ATMF.DiscoverTemplate('header');

/** ************** **/




/** **************** **/
/** Some nested data **/
/** **************** **/

var authors = [
    {
        firstName: 'William',
        lastName: 'Shakespeare',
        books: ['Hamlet', 'Macbeth', 'Romeo and Juliet', 'The Tempest'],
        soldOut: false
    },
    {
        firstName: 'William',
        lastName: 'Faulkner',
        books: ['Light in August', 'Sanctuary', 'A Fable', 'The Hamlet'],
        soldOut: false
    },
    {
        firstName: 'Paulo',
        lastName: 'Coelho',
        books: ['The Alchemist', 'Eleven Minutes', 'The Zahir', 'Adultery '],
        soldOut: true
    }
];

__('$authors', authors);


// Rend and export
var source = ATMF.Rend();
export { source as default };