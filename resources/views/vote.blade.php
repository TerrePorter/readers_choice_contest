<x-layouts::guest :title="__('Tampa Bay Newspapers')">
    <style>
        .loader {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            display: block;
            margin:15px auto;
            position: relative;
            background: #FFF;
            box-shadow: -24px 0 #FFF, 24px 0 #FFF;
            box-sizing: border-box;
            animation: shadowPulse 2s linear infinite;
        }

        @keyframes shadowPulse {
            33% {
                background: #FFF;
                box-shadow: -24px 0 #FF3D00, 24px 0 #FFF;
            }
            66% {
                background: #FF3D00;
                box-shadow: -24px 0 #FFF, 24px 0 #FFF;
            }
            100% {
                background: #FFF;
                box-shadow: -24px 0 #FFF, 24px 0 #FF3D00;
            }
        }

    </style>
    <script>
        function searchBiz() {
            return {
                new_search_biz: {},
                campaign: {!! json_encode($campaign) !!},
                categoryGroups: {!! json_encode($category_groups) !!},
                searchForm: {},
                formHasResults: {},
                formResults: {},
                savedResults: {},
                NewBizForm: {},
                selected_group_category_label_id: {},
                selected_group_category_label_name : {},
                showSaveBallotButton: false,
                numberOfBallots: 0,
                maxNumberOfBallots: 10,
                category_id: {{$campaign['categories']['id']}},
                show_success_vote: false,
                skipActiveSelection: false,

                init() {

                    console.log(this.campaign);
                    @foreach($campaign['categories']['categories_groups'] as $cg)


                        this.searchForm[{{ $cg['id'] }}] = {};
                        this.new_search_biz[{{ $cg['id'] }}] = {};
                        this.formHasResults[{{ $cg['id'] }}] = {};
                        this.formResults[{{ $cg['id'] }}] = {};
                        this.savedResults[{{ $cg['id'] }}] = {};
                        this.NewBizForm[{{ $cg['id'] }}] = {};

                        @foreach($cg['categories_group_categories'] as $cgc)

                            this.searchForm[{{ $cgc['categories_groups_id'] }}][{{ $cgc['categories_labels_id'] }}] = false;
                            this.new_search_biz[{{ $cgc['categories_groups_id'] }}][{{ $cgc['categories_labels_id'] }}] = '';
                            this.formHasResults[{{ $cgc['categories_groups_id'] }}][{{ $cgc['categories_labels_id'] }}] = false;
                            this.formResults[{{ $cgc['categories_groups_id'] }}][{{ $cgc['categories_labels_id'] }}] = {};
                            this.savedResults[{{ $cgc['categories_groups_id'] }}][{{ $cgc['categories_labels_id'] }}] =  {'visible': false, 'item' : {}};
                            this.NewBizForm[{{ $cgc['categories_groups_id'] }}][{{ $cgc['categories_labels_id'] }}] =  {'visible': false, 'item' : {
                                    'name': '',
                                    'address': '',
                                    'city': '',
                                    'zipcode': '',
                                }};




                            @if ($loop->first)
                                console.log({{ $cgc['categories_groups_id'] }}, {{ $cgc['categories_labels_id'] }});

                                var BreakException={};
                                try {
                                    Object.entries( this.categoryGroups[{{$cgc['categories_groups_id'] }}]).forEach(([index, item]) => {
                                       if (item.id == {{$cgc['categories_labels_id']}}) {

                                           this.categoryGroups[{{$cgc['categories_groups_id'] }}][index]['selected'] = true;
                                           throw BreakException;
                                       }
                                    });
                                } catch (e) {
                                    // do nothing
                                }

                                //this.resetCategorySelection({{ $cgc['categories_groups_id'] }}, {{ $cgc['categories_labels_id'] }}, true);
                                this.selected_group_category_label_id[{{ $cgc['categories_groups_id'] }}] = {{ $cgc['categories_labels_id'] }};
                                this.selected_group_category_label_name[{{ $cgc['categories_groups_id'] }}] = '{{ $cgc['categories_labels']['name'] }}';
                                this.searchForm[{{ $cgc['categories_groups_id'] }}][{{ $cgc['categories_labels_id'] }}] = true;

                           @endif

                        @endforeach
                    @endforeach
                },

                saveBallot() {

                    console.log('saveBallot');
                    console.log(this.savedResults);

                    this.handleDataSend('saveBallot', 'handleSaveBallot', {
                        campaign_id : this.campaign['id'],
                        category_id : this.category_id,
                        new_records_list: this.savedResults
                    });


                },

                handleSaveBallot(jsonData) {
                    //alert(jsonData['message']);
                    //window.location.reload();
                    this.show_success_vote = true;


                },

                displayNewBizForm(cg_id) {
                    this.NewBizForm[cg_id][this.selected_group_category_label_id[cg_id]]['visible'] = true;
                    this.NewBizForm[cg_id][this.selected_group_category_label_id[cg_id]]['item']['name'] = '';
                    this.NewBizForm[cg_id][this.selected_group_category_label_id[cg_id]]['item']['address'] = '';
                    this.NewBizForm[cg_id][this.selected_group_category_label_id[cg_id]]['item']['city'] = '';
                    this.NewBizForm[cg_id][this.selected_group_category_label_id[cg_id]]['item']['zipcode'] = '';
                    this.NewBizForm[cg_id][this.selected_group_category_label_id[cg_id]]['loader_visible'] = false;
                },

                saveNewBizForm(cg_id) {

                    this.NewBizForm[cg_id][this.selected_group_category_label_id[cg_id]]['loader_visible'] = true;

                    this.handleDataSend('saveNewBizForm', 'handleSaveNewBizForm', {
                        new_biz: this.NewBizForm[cg_id][this.selected_group_category_label_id[cg_id]]['item'],
                        cg_id: cg_id,
                        category_id : cg_id,
                        selected_labels_db: this.campaign['selected_labels_db'],
                        label_id: this.selected_group_category_label_id[cg_id]
                    });


                },

                handleSaveNewBizForm(jsonData) {

                    if (jsonData['status']) {
                        this.savedResults[jsonData['cg_id']][this.selected_group_category_label_id[jsonData['cg_id']]]['item'] = jsonData['results'];

                        this.NewBizForm[jsonData['cg_id']][this.selected_group_category_label_id[jsonData['cg_id']]]['visible'] = false;
                        this.savedResults[jsonData['cg_id']][this.selected_group_category_label_id[jsonData['cg_id']]]['visible'] = true;
                        this.formHasResults[jsonData['cg_id']][this.selected_group_category_label_id[jsonData['cg_id']]] = false;
                        this.searchForm[jsonData['cg_id']][this.selected_group_category_label_id[jsonData['cg_id']]] = false;

                        this.resetCategorySelection(cg_id, label_id, false);

                    } else {
                        alert(jsonData['message']);
                    }
                },

                clearSaved(cg_id) {
                    this.new_search_biz[cg_id][this.selected_group_category_label_id[cg_id]]= '';
                    this.savedResults[cg_id][this.selected_group_category_label_id[cg_id]]['visible'] = false;
                    this.formHasResults[cg_id][this.selected_group_category_label_id[cg_id]] = false;
                    this.searchForm[cg_id][this.selected_group_category_label_id[cg_id]] = false;
                    this.resetCategorySelection(cg_id, this.selected_group_category_label_id[cg_id]);
                },

                selectShowForm(cg_id, label_id, cg_name) {``
                    this.resetCategorySelection(cg_id, label_id,false);
                    this.searchForm[cg_id][this.selected_group_category_label_id[cg_id]] = false;
                    this.selected_group_category_label_id[cg_id] = label_id;
                    this.selected_group_category_label_name[cg_id] = cg_name;
                    this.searchForm[cg_id][label_id] = true;
                },

                bizSearch(cg_id) {

                    this.NewBizForm[cg_id][this.selected_group_category_label_id[cg_id]]['visible'] = false;

                    this.handleDataSend('searchBiz', 'handleSearchBiz', {
                        search: this.new_search_biz[cg_id][this.selected_group_category_label_id[cg_id]],
                        cg_id: cg_id,
                        category_id : cg_id,
                        selected_labels_db: this.campaign['selected_labels_db'],
                        label_id: this.selected_group_category_label_id[cg_id]
                    });
                },

                handleSearchBiz(jsonData) {
                    if (jsonData['status']) {
                        if (jsonData['has_results']) {
                            this.formHasResults[jsonData['cg_id']][this.selected_group_category_label_id[jsonData['cg_id']]] = jsonData['has_results'];
                            this.formResults[jsonData['cg_id']][this.selected_group_category_label_id[jsonData['cg_id']]] = jsonData['results'];
                        } else {
                            alert(jsonData['message']);
                        }

                    } else {
                        alert('failed to load businesses');
                    }
                },

                selectBiz(cg_id, item_id, item) {

                    this.savedResults[cg_id][this.selected_group_category_label_id[cg_id]]['visible'] = true;
                    this.savedResults[cg_id][this.selected_group_category_label_id[cg_id]]['item'] = item;
                    this.formHasResults[cg_id][this.selected_group_category_label_id[cg_id]] = false;
                    this.searchForm[cg_id][this.selected_group_category_label_id[cg_id]] = false;
                    this.resetCategorySelection(cg_id, item_id,false);
                },

                resetCategorySelection (cg_id, label_id, skipActiveSelection = false) {

                    this.numberOfBallots = 0;

                    Object.entries(this.categoryGroups).forEach(([index, value1]) => {

                        console.log(value1);

                            Object.entries(this.categoryGroups[index]).forEach(([key, value]) => {



                                    console.log( "---- 2");
                                    console.log( 'index: ' + index);
                                    console.log( 'key: ' +key);
                                    console.log( 'lab id: ' + label_id);
                                    console.log( 'val id: ' +value.id);
                                    console.log( value);



                                    if (this.savedResults[index][value.id]['visible']) {
                                       this.categoryGroups[index][key]['selected'] = true;
                                        this.numberOfBallots++;
                                    }else{
                                       this.categoryGroups[index][key]['selected'] = false;
                                        if (value.id === label_id) {
                                            this.categoryGroups[index][key]['selected'] = true;
                                        }
                                    }

                                console.log( this.categoryGroups[index][key]['selected'] );

                        });

                    });

                    this.showSaveBallotButton = this.numberOfBallots >= this.maxNumberOfBallots;

                },
                async handleDataSend(dsCommand, dsCallback, dsData) {
                    await (await fetch('{{ route('alpineDataSend') }}', {
                            method: 'POST',
                            body: JSON.stringify({
                                command: dsCommand,
                                data: dsData
                            }),
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-TOKEN': '{{ csrf_token() }}'
                            },
                        }).then((response) => response.json()).then((json) => this[dsCallback](json))
                    )
                },
            }
        }
    </script>
    @if( !$has_results)
        <div class="max-w-7xl m-auto p-6">
            Unable to load ballot.
            <a href="/">Return to the front page</a>
        </div>
    @else
        <div class="max-w-7xl m-auto p-6" x-data="searchBiz">
            <img src="{{$campaign['banner_image']}}">
            <div id="intro_text_div">
                <div class="row">
                    <div class="col-10">

                        <div class="top_text_info_div">
                            <img class="hide-phone hide-tablet" src="{{ asset('assets/images/rc-block.png') }}" style="float: right; width: 200px;">
                            @foreach(explode("\n",$campaign['infotext']['text']) as $infotext)
                                <p style="padding: 10px;">{{$infotext}}</p>
                            @endforeach
                        </div>
                    </div>
                </div>

                <div class="mx-auto max-w-5xl">
                    <div class="bg-amber-100 border border-amber-400 text-amber-700 py-3 rounded">
                        <p class="text-center">
                            Improperly completed ballots will be eliminated.
                        </p>
                    </div>
                </div>

                <div x-show="show_success_vote">

                    <div class="mx-auto max-w-5xl">
                        <div class="bg-green-100 border border-green-400 text-green-700 py-3 rounded">
                            <p class="text-center">
                                Ballot saved! <span @click="window.location.reload()">Vote again!</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div x-show="!show_success_vote">
                <template x-for="cg in campaign.categories.categories_groups" key="'ccg' + cg.id">

                    <div class="mt-16">
                    <div class="w-full ml-2 text-2xl font-bold text-gray-800" x-text="cg.name"></div>
                    <div class="flex flex-col md:flex-row gap-4"  >
                        <div class="w-full md:w-1/3">
                            <div class="bg-white shadow-md rounded-md overflow-hidden max-w-lg mx-auto ">
                                <div class="bg-gray-100 py-2 px-4">
                                    <h2 class="text-xl font-semibold text-gray-800">Categories</h2>
                                </div>
                                <div class="h-72 overflow-y-auto">
                                <ul class="divide-y divide-gray-200">
                                    <template x-for="(item, index) in categoryGroups[cg.id]" key="index">
                                        <li @click="selectShowForm(cg.id, item.id, item.name)" class="flex items-center cursor-pointer py-4 px-6 hover:bg-green-300" :class="{'bg-blue-300' : item.selected}" >
                                            <div class="flex-1">
                                                <h3  class=" text-lg text-gray-800" x-text="item.name">Emily Jones</h3>
                                            </div>
                                        </li>
                                    </template>

                                </ul>
                            </div>
                            </div>
                        </div>
                        <div x-show="!savedResults[cg.id][selected_group_category_label_id[cg.id]]['visible']" class="w-full ">
                            <div>
                                Search <span x-text="selected_group_category_label_name[cg.id]"></span>
                            </div>
                            <div class="flex justify-between w-full">
                                <input
                                    id="searchBiz"
                                    class="border p-3 shadow-md  border-gray-700 placeholder:text-base focus:outline-none ease-in-out duration-300 rounded-lg w-full"
                                    type="text"
                                    placeholder="Search Business..."
                                    x-model="new_search_biz[cg.id][selected_group_category_label_id[cg.id]]"
                                />
                                <button @click="bizSearch(cg.id)" type="button"
                                        class="inline-flex items-center justify-center py-1 gap-1 font-medium rounded-lg border transition-colors outline-none focus:ring-offset-2 focus:ring-2 focus:ring-inset dark:focus:ring-offset-0 min-h-[2.25rem] px-4 text-sm text-gray-800 bg-white border-gray-300 hover:bg-gray-50 focus:ring-primary-600 focus:text-primary-600 focus:bg-primary-50 focus:border-primary-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-600 dark:hover:border-gray-500 dark:text-gray-200 dark:focus:text-primary-400 dark:focus:border-primary-400 dark:focus:bg-gray-800">
                                    Search <span x-text="cg.id"></span>
                                </button>
                            </div>
                            <div x-show="formHasResults[cg.id][selected_group_category_label_id[cg.id]]" class=" w-full">
                                <ul class="divide-y divide-gray-200 mt-2">
                                    <template x-for="(item, index) in formResults[cg.id][selected_group_category_label_id[cg.id]]" key="index">
                                        <li @click="selectBiz(cg.id, item.id, item)" class="cursor-pointer flex items-center py-4 px-6 hover:bg-green-300"  >
                                            <div class="flex-row flex">
                                                <div class=" text-lg text-gray-800 pr-2" x-text="item.name">Emily Jones</div> - <div class="pl-2  text-lg text-gray-800" x-text="item.address">address</div>
                                            </div>
                                        </li>
                                    </template>
                                </ul>
                            </div>
                            <div x-show="!formHasResults[cg.id][selected_group_category_label_id[cg.id]]" class=" w-full">
                                <div x-show="!NewBizForm[cg.id][selected_group_category_label_id[cg.id]]['visible']" class="bg-blue-100 border border-blue-400 text-blue-700 py-3 mt-2 rounded">
                                    <p class="text-center">
                                        No results found. <br> Start with a couple letters of the business name, then click search.
                                    </p>
                                    <div class="m-auto pl-2 text-center underline text-blue-600 cursor-pointer" @click="displayNewBizForm(cg.id)">Create a NEW Business Entry</div>
                                </div>
                                <div x-show="NewBizForm[cg.id][selected_group_category_label_id[cg.id]]['visible']" class="mt-3">
                                    <div>
                                        <div class="mt-5 bg-white rounded-lg shadow">
                                            <div class="flex">
                                                <div class="flex-1 py-5 pl-5 overflow-hidden">
                                                    <svg class="inline align-text-top" height="24px" viewBox="0 0 24 24" width="24px" xmlns="http://www.w3.org/2000/svg" fill="#000000">
                                                        <g>
                                                            <path d="m4.88889,2.07407l14.22222,0l0,20l-14.22222,0l0,-20z" fill="none" id="svg_1" stroke="null"></path>
                                                            <path d="m7.07935,0.05664c-3.87,0 -7,3.13 -7,7c0,5.25 7,13 7,13s7,-7.75 7,-13c0,-3.87 -3.13,-7 -7,-7zm-5,7c0,-2.76 2.24,-5 5,-5s5,2.24 5,5c0,2.88 -2.88,7.19 -5,9.88c-2.08,-2.67 -5,-7.03 -5,-9.88z" id="svg_2"></path>
                                                            <circle cx="7.04807" cy="6.97256" r="2.5" id="svg_3"></circle>
                                                        </g>
                                                    </svg>
                                                    <h1 class="inline text-2xl font-semibold leading-none">Enter the Business Information</h1>
                                                </div>
                                            </div>
                                            <div class="px-5 pb-5">
                                               {{-- <input  placeholder="Name"
                                                        x-model="NewBizForm[cg.id][selected_group_category_label_id[cg.id]]['item']['name']"
                                                        class=" text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400">
--}}
                                               {{-- <input  placeholder="Address" x-model="NewBizForm[cg.id][selected_group_category_label_id[cg.id]]['item']['address']"
                                                        class=" text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400">--}}
                                                <div class="flex">

                                                    <div class="grow pr-2">
                                                        <input  placeholder="Name"
                                                                x-model="NewBizForm[cg.id][selected_group_category_label_id[cg.id]]['item']['name']"
                                                                class=" text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400">

                                                    </div>

                                                    <div class="grow w-1/4 pr-2">
                                                        <input placeholder="City"
                                                               x-model="NewBizForm[cg.id][selected_group_category_label_id[cg.id]]['item']['city']"
                                                               class=" text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400">
                                                    </div>{{--
                                                    <div class="grow ">
                                                        <input  placeholder="Zipcode" x-model="NewBizForm[cg.id][selected_group_category_label_id[cg.id]]['item']['zipcode']"
                                                                class=" text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400">
                                                    </div>--}}
                                                </div>
                                            </div>
                                            <div x-show="NewBizForm[cg.id][selected_group_category_label_id[cg.id]]['loader_visible']" class="loader "></div>
                                            <div x-show="!NewBizForm[cg.id][selected_group_category_label_id[cg.id]]['loader_visible']" class="flex-initial pl-3 pb-2">
                                                <button @click="saveNewBizForm(cg.id)" type="button" class="flex items-center px-5 py-2.5 font-medium tracking-wide text-white capitalize   bg-black rounded-md hover:bg-gray-800  focus:outline-none focus:bg-gray-900  transition duration-300 transform active:scale-95 ease-in-out">
                                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF">
                                                        <path d="M0 0h24v24H0V0z" fill="none"></path>
                                                        <path d="M5 5v14h14V7.83L16.17 5H5zm7 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-8H6V6h9v4z" opacity=".3"></path>
                                                        <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm2 16H5V5h11.17L19 7.83V19zm-7-7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM6 6h9v4H6z"></path>
                                                    </svg>
                                                    <span class="pl-2 mx-1">Save</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div x-show="savedResults[cg.id][selected_group_category_label_id[cg.id]]['visible']" class="w-full md:w-2/3 mt-2">
                            <div class="bg-yellow-100 border border-yellow-400 text-yellow-700 py-3 mt-2 rounded">
                                <p class="text-center text-2xl">
                                    Selected Business
                                </p>
                                <div class="flex items-center py-4 px-6 bg-amber-100">
                                    <div class="flex flex-row">
                                        <div class=" text-lg text-gray-800 pr-2" x-text="savedResults[cg.id][selected_group_category_label_id[cg.id]]['item'] ? savedResults[cg.id][selected_group_category_label_id[cg.id]]['item']['name'] : ''">Emily Jones</div> - <div class="pl-2  text-lg text-gray-800" x-text="savedResults[cg.id][selected_group_category_label_id[cg.id]]['item'] ? savedResults[cg.id][selected_group_category_label_id[cg.id]]['item']['address'] : ''">address</div>
                                    </div>
                                </div>
                                <button @click="clearSaved(cg.id)" type="button"
                                        class="inline-flex items-center justify-center py-1 gap-1 font-medium rounded-lg border transition-colors outline-none focus:ring-offset-2 focus:ring-2 focus:ring-inset dark:focus:ring-offset-0 min-h-[2.25rem] px-4 text-sm text-gray-800 bg-white border-gray-300 hover:bg-gray-50 focus:ring-primary-600 focus:text-primary-600 focus:bg-primary-50 focus:border-primary-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-600 dark:hover:border-gray-500 dark:text-gray-200 dark:focus:text-primary-400 dark:focus:border-primary-400 dark:focus:bg-gray-800">
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                    </div>
                </template>


                <div class="mx-auto max-w-5xl">
                    <div class="flex justify-between bg-gray-100 border border-gray-400 text-gray-700 py-3 rounded mt-5">
                        <div class="text-center p-2">
                            Have <span x-text="numberOfBallots"></span> of <span x-text="maxNumberOfBallots"></span> ballot entries!
                        </div>
                        <button x-show="showSaveBallotButton" @click="saveBallot()" type="button"
                                class="mr-2 items-center justify-center py-1 gap-1 font-medium rounded-lg border
                        transition-colors outline-none focus:ring-offset-2 focus:ring-2 focus:ring-inset dark:focus:ring-offset-0 min-h-[2.25rem] px-4
                        text-sm text-blue-800 bg-white border-blue-300 hover:bg-green-50 focus:ring-primary-600 focus:text-primary-600 focus:bg-primary-50 focus:border-primary-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-600 dark:hover:border-gray-500 dark:text-gray-200 dark:focus:text-primary-400 dark:focus:border-primary-400 dark:focus:bg-gray-800">
                            Save
                        </button>
                    </div>
                </div>
                <div>

            </div>
        </div>
    @endif




</x-layouts::guest>
