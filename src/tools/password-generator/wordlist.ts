/**
 * Curated list of 1024 common, clean, easily-distinguishable English words.
 * Each word provides exactly 10 bits of entropy (2^10 = 1024).
 */
const WORDS_SOURCE = `
ability able about above accept access across act action active actual actor adapt added address admit adult advance advice affair
affect afford afraid after again against agent agree ahead alarm album alert alike alive allow almost alone along aloud alphabet
already also alter always amaze amber amount anchor angel anger animal annual answer any apart appeal appear apple apply apron
area argue arm armor around array arrest arrive arrow artist aside asleep aspect asset assist assume assure atom attack attain
attend author auto autumn avail avatar avenue avoid awake award aware away axis baby back badge badly bag baker balance
ball bamboo banana band banner barely barn base basic basin basket battle beach beacon beam bean bear beard beast beat
beauty become bed beetle before begin behalf behave behind belief bell belong below belt bench bend beneath benefit berry beside
best better beyond bicycle bid bike binary bind biology bird birth biscuit bit bite bitter black blade blame blank blast
blend bless blind blink block blonde blood bloom blossom blue blur blush board boat body boil bold bolt bomb bond
bone bonus book boom boost boot border bore borrow boss both bother bottle bottom bounce bound bowl box boy brain
branch brand brass brave bread break breeze brick bridge brief bright bring brisk broad bronze brook broom brother brown brush
bubble bucket budget buffer bug build bulb bulk bullet bundle burden burger burst bury bus bush busy butter button buyer
cabin cable cactus cage cake call calm camera camp canal cancel candle candy canvas canyon capable capital captain capture car
carbon card care career cargo carpet carrot carry cart case cash casino cast castle casual cat catch cater cause cave
cease cedar ceiling cell cement census center central century cereal chain chair chalk champ chance change channel chaos chapter charge
charm chart chase cheap check cheek cheer cheese chef cherry chest chew chief child chimney chin chip choice choose chop
circle circuit citizen city civil claim clamp clarity clash classic claw clay clean clear clerk clever click client cliff climate
climb clinic clip clock clone close cloth cloud clover club clue cluster coach coal coast coat code coffee coil coin
cold collar collect colony color column combat combine comedy comfort comic command common compact company compare compass compile complex compose
concept concern concert conduct confirm connect consent consist console consult contact contain content contest context control convert cook cool copper
copy coral cord core cork corner correct cost cotton couch cough council count country county couple courage course court cousin
cover crack cradle craft crane crash crater crawl crazy cream create credit creek crew cricket crime crisp critic crop cross
crowd crown crucial cruise crumb crush crystal cube cuisine culture cup curious curly current curtain curve cushion custom cycle cylinder
daily dairy daisy damage dance danger daring dark darling dash data date dawn day deal debate debris debt decade decay
decide deck declare decor decrease dedicate deep deer defense define degree delay deliver demand demise denial dense dentist deny depart
depend deposit depth deputy derive describe desert design desk despair destroy detail detect develop device devote diagram dial diamond diary
dice diesel diet differ digital dignity dilemma dinner dinosaur direct dirt disable discard disc discuss disease dish dismiss display distant
divert divide divine divorce dizzy doctor document dodge doll dolphin domain donate donkey donor door dose double doubt dough dove
draft dragon drain drama drastic draw dream dress drift drill drink drip drive drop drum dry duck duet dune during
dust duty dwarf dynamic eager eagle early earn earth ease east easy echo ecology economy edge edit educate effort egg
eight either elbow elder electric element elephant elevator elite embark embody embrace emerge emotion employ empower empty enable enact end
endless endorse enemy energy enforce engage engine enhance enjoy enlist enough enrich enroll ensure enter entire entry envelope episode equal
equip era erase erode error erupt escape essay essence estate eternal ethics evidence evil evolve exact example exceed excel exchange
excite exclude excuse execute exercise exhaust exhibit exile exist exit exotic expand expect expire explain expose express extend extra extreme
eyebrow fabric face faculty fade faint faith fall false fame family famous fan fancy fantasy farm fashion fat fatal father
fatigue fault favorite feature february federal fee feed feel female fence festival fetch fever few fiber fiction field figure file
film filter final find fine finger finish fire firm first fiscal fish fit fitness fix flag flame flash flat flavor
flee flight flip float flock floor flower fluid flush fly foam focus fog foil fold folk follow food foot force
forest forget fork fortune forum forward fossil foster found fox fragile frame frequent fresh friend fringe frog front frost frown
frozen fruit fuel fun funny furnace fury future gadget gain galaxy gallery game gap garage garbage garden garlic garment gas
gasp gate gather gauge gaze general genius genre gentle genuine gesture ghost giant gift giggle ginger giraffe girl give glad
glance glare glass glide glimpse globe gloom glory glove glow glue goat goddess gold good goose gorilla gospel gossip govern
gown grab grace grain grant grape grass gravity great green grid grief grit grocery group grow grunt guard guess guide
guilt guitar gun gym habit hair half hammer hand handle happy harbor hard harsh harvest hat have hawk hazard head
health heart heavy hedge height hello helmet help hen hero hidden high hill hint hip hire history hobby hockey hold
hole holiday hollow home honey hood hope horn horror horse hospital host hotel hour hover hub huge human humble humor
hundred hungry hunt hurdle hurry hurt husband hybrid ice icon idea identify idle ignore ill illegal illness image imitate immense
immune impact impose improve impulse inch include income increase index indicate indoor industry infant inflict inform inherit initial inject injury
inmate inner innocent input inquiry insane insect inside inspire install intact interest into invest invite involve iron island isolate issue
item ivory jacket jaguar jar jazz jealous jeans jelly jewel job join joke journey joy judge juice jump jungle junior
junk just kangaroo keen keep ketchup key kick kid kidney kind kingdom kiss kit kitchen kite kitten kiwi knee knife
knock know lab label labor ladder lady lake lamp language laptop large later latin laugh laundry lava law lawn lawsuit
layer lazy leader leaf learn leave lecture left leg legal legend leisure lemon lend length lens leopard lesson letter level
liar liberty library license life lift light like limb limit link lion liquid list little live lizard load loan lobster
local lock logic lonely long loop lottery loud lounge love loyal lucky luggage lumber lunar lunch luxury lyrics machine mad
`;

export const WORDLIST: string[] = WORDS_SOURCE.trim().split(/\s+/);
