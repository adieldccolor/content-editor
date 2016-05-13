(function (){
    "use strict";

    /*
    * This Controller contains the most important functionality of the application
    *
    * @param {String} controller name
    * @param {Function} the functionalities scope
    */

    angular.module('app.controllers').controller('ContentEditor',
      function ($scope, Pages, PagesList, PageDetails, $document, ToastService, DialogService, $state, $http, $filter, $window ) {

        var self = this;

        //With this variable whether the page is ready or no
        self.pageReady = true;

        //Let the app know if something is loading or no
        $scope.loading = true;

        //Let the app know if the current page is in preview or not
        self.preview = false;

        //Check if the tool is supported or not
        self.supported = _config.isSupported||false;


        //concatenate website URL
        self.baseWebsiteUrl = (_config.baseClientSiteUrl||'/') + '?s=' + (_config.SiteAlias||'');

        //toggle if trahed or not => filter
        self.trashed = false;

        //filter item by trashed or published
        self.showFiltered = function(created_at) {
          if ( self.trashed ) {
            return created_at;
          }

          return !created_at;
        };

        $scope.toggleFilter = function() {
          self.trashed = !self.trashed;
        };

        self.activePages = function() {
          if ( self.trashed ) {
            return PagesList.filter(function(item){
              return item.deleted_at;
            });
          }

          return PagesList.filter(function(item){
            return !item.deleted_at;
          });
        };

        /*
        * This function will toggle state for self.preview variable (boolean)
        *
        * @param {Event} $event
        */
        $scope.togglePreview = function($event){

          //Toggle the variable
          self.preview = !self.preview;

          //Check if the variable is true to go fullScreen
          if ( self.preview ) {
            $scope.toggleFullscreen($event, true, true);
          }
        };

        //body selector
        $scope.body = angular.element(document.body);

        //window selector
        $scope.w = angular.element($window);

        //listen for the window to be resized
        $scope.w.bind('resize', function(){

          //resize the editor width
          PageDetails.fn.resizeArea(true, $scope.fullScreen);

          //fit the elements on the workflow space
          PageDetails.fn.fitScreen($scope.fullScreen);
        });

        //Let the app know if the page is in fullScreen or not
        $scope.fullScreen = false;

        /*
        * This function will toggle state for $scope.fullScreen variable (boolean)
        *
        * @param {Event} $event
        * @param {Boolean} set (optional)
        */
        $scope.toggleFullscreen = function($event, set, forcePreview){

          //Check if the current state is preview On and fullScreen On, then close the preview first
          if ( self.preview && $scope.fullScreen ) {
            self.preview = forcePreview||false;
          }

          //toggle the variable by checking optional variable "set" or invert the current
          $scope.fullScreen = set||!$scope.fullScreen;

          //resize the editor width
          PageDetails.fn.resizeArea(true, $scope.fullScreen);

          //fit the elements on the workflow space
          PageDetails.fn.fitScreen($scope.fullScreen);

          //Reset the body class for fullScreen
          $scope.body.removeClass('is-fullscreen');

          //Then check if fullScreen is On now, so add the body class again, else do nothing
          if ( $scope.fullScreen ) {
            $scope.body.addClass('is-fullscreen');
          }

        };

        //With this scope function we will listen for the onchange event on the inputs title, body, and seo of the current page
        // and then let the app know that it should change it statuses
        $scope.pageInputChange = function(){

          //store title, body in seo
          $scope.updateSEOInputChange();

          //If we are listenChanges so preventSaving will be active and prevent leaving a page without saving/canceling edit
          if( PageDetails.edition.listenChanges ){
            PageDetails.edition.preventSaving = true;
            return true;
          }

          //If listenChanges was off, so set turn it On
          PageDetails.edition.listenChanges = true;
        };

        $scope.seoInputChange = function($event){

          if ( $event ) {
            var $target = angular.element($event.target)[0];
            if ( $target.name == "description" && $event.keyCode == 13 ) {
              $event.preventDefault(); 
              $event.stopPropagation();

              return false;
            }
          }

          PageDetails.edition.syncSeo = "off";

          //If we are listenChanges so preventSaving will be active and prevent leaving a page without saving/canceling edit
          if( PageDetails.edition.listenChanges ){
            PageDetails.edition.preventSaving = true;
            return true;
          }

          //If listenChanges was off, so set turn it On
          PageDetails.edition.listenChanges = true;
        };

        /*
        * Update current page seo when we save
        *
        * @param {Object} p is the page instance
        */
        $scope.updateSEOFromEdit = function (p) {

          //Use the strip_html_tags filters (find it in angular/filters folder)
          var striped_body = $filter('strip_html_tags')(p.seo.description);
          var description = (striped_body||"").substr(0, 150);

          PageDetails.seo.title = p.seo.title;
          PageDetails.seo.description = description;
          PageDetails.seo.keywords = p.seo.keywords;

          PageDetails.edition.seo.title = p.seo.title;
          PageDetails.edition.seo.description = description;
          PageDetails.edition.seo.keywords = p.seo.keywords;
        };

        //Variable to bind the seo panel visibility when editor mode is normal (not expanded)
        $scope.panelVisible = true;

        /*
        * Toggle visibility for the seo panel
        *
        * @param {Event} $event is the event passed from the ngClick directive
        */
        $scope.toggleSEOPanel = function ($event) {

          //Continue if not fullScreen
          if ( !$scope.fullScreen ) {

            //Invert the panel visibility Variable binded
            $scope.panelVisible = !$scope.panelVisible;
          }
        };

        //Update current page seo on the fly
        $scope.updateSEOInputChange = function () {

          //Use the strip_html_tags filters (find it in angular/filters folder)
          var striped_body = $filter('strip_html_tags')(PageDetails.edition.body);
          var description = (striped_body||"").substr(0, 150);
          
          var title = PageDetails.edition.title.substr(0, 100);

          if ( PageDetails.edition.syncSeo == "off" ) {
            return false;
          }

          PageDetails.edition.seo.description = description;
          PageDetails.edition.seo.title = title;
        };

        //Update the page list array and so the page list view will be updated
        $scope.updatePageList = function(){
          for (var i = 0; i < PagesList.length; i++) {
            if( PagesList[i].id == PageDetails.id ){
              PagesList[i].title = PageDetails.edition.title;
              PagesList[i].body = PageDetails.edition.body;
              PagesList[i].seo.title = PageDetails.edition.seo.title;
              PagesList[i].seo.description = PageDetails.edition.seo.description;
              PagesList[i].seo.keywords = PageDetails.edition.seo.keywords;
            }
          }

          $scope.PagesList = PagesList;
        };

        //Reload the pagelist resource from the server to ensure the pages just removed from the server are removed from the UI
        $scope.removeFromPageList = function(){

          //Set the scope to loading
          $scope.loading = true;

          //Query all the pages from the sever
          Pages.query().$promise.then(function (response) {
              //Reasign to the pagelist factory
              PagesList = response;
              $scope.PagesList = PagesList;

              //set the loading state to false
              $scope.loading = false;
          });
        };

        /*
        * Cancel the page edition when cancelButton is clicked
        *
        * @param {Event} $event is the event passed by ngClick
        */
        $scope.cancelPageEdit = function($event){
          PageDetails.edition.preventSaving = false;
          PageDetails.edition.listenChanges = false;
          PageDetails.edition.body = PageDetails.body;
          PageDetails.edition.title = PageDetails.title;
          PageDetails.edition.seo = PageDetails.seo;
        };

        /*
        * Remove a page from the server
        *
        * @param {Event} $event is the event passed by ngClick
        */
        $scope.removePage = function($event){

          //When the confirm Dialog triggers OK by the user action, remove it
          var onConfirmRemove = function onConfirmRemove() {

            //Set the editor status to loading
            $scope.loading = true;

            //pageQuery to execute on the current page querying
            var pageQuery = {
              id: PageDetails.id //Required by php webservice,
            };

            if ( !_config.touched ) {
              pageQuery.sp = 'pages/single'; //required for local environment
            }

            //Query the current page to ensure it exists in the server
            Pages.get(pageQuery, function(resource){

              //Proceed to destroy the page from the server
              resource.$destroy(function(response) {

                //Update PagesList factory to update UI
                $scope.removeFromPageList();
                $scope.PageDetails = PageDetails;


                setTimeout(function() {
                  //Show a toast message confirming page deletion
                  ToastService.show('The page was removed successfully!');

                  //Set the editor status to not loading (ready)
                  $scope.loading = false;
                }, 500);

                PageDetails.edition.preventSaving = false;
                PageDetails.edition.listenChanges = false;

                //Redirect to homepage
                $state.go('pageEdit', { page: _config.rootFile,pageId: '' });
              });
            });

          };

          //Trigger when confirmation dialog is canceled by user action
          var onCancelLeave = function onCancelLeave() {
            //do nothing
          };

          DialogService.confirm('Remove page', 'Are you sure do you want to remove this page?',
            'Yes, remove', 'Cancel', onConfirmRemove, onCancelLeave, $scope, $event);

        };


        /*
        * Restore a page from the server
        *
        * @param {Event} $event is the event passed by ngClick
        */
        $scope.restorePage = function($event){



          //Set the editor status to loading
          $scope.loading = true;

          //pageQuery to execute on the current page querying
          var pageQuery = {
            id: PageDetails.id //Required by php webservice,
          };

          if ( !_config.touched ) {
            pageQuery.sp = 'pages/single'; //required for local environment
          }

          //Query the current page to ensure it exists in the server
          Pages.get(pageQuery, function(resource){

            //TODO: ensure you are getting a valid json object and not a resource instance
            // var page = resource.toJSON();

            //For now leave the ngResource default method Request Payload and not normal POST
            // var page = resource;

            //Proceed to destroy the page from the server
            resource.$restore(function(response) {

              //Update PagesList factory to update UI
              $scope.removeFromPageList();
              $scope.PageDetails = PageDetails;


              setTimeout(function() {
                //Show a toast message confirming page deletion
                ToastService.show('The page was restored successfully!');

                //Set the editor status to not loading (ready)
                $scope.loading = false;
              }, 500);

              PageDetails.edition.preventSaving = false;
              PageDetails.edition.listenChanges = false;

              PageDetails.deleted_at = null;
              self.trashed = false;
            });
          });

        };


        /*
        * This works for 2 purposes, to create a new page, or to update an existing one
        *
        * @param {Event} $event is the event passed by ngClick
        */
        $scope.savePage = function($event){

          //Set the editor status to loading
          $scope.loading = true;

          //If current page id is empty so it means we want to create a new page
          if( !PageDetails.id ){

            //Create a new instance of the factory to init a new page
            var page = new Pages(PageDetails.edition);

            page.seo = JSON.stringify(page.seo);
            page.SiteID = _config.SiteID||'';

            if( typeof console !== "undefined" ) {
              console.log(PageDetails.edition);
            }

            //Send it to the server
            page.$create(function(data) {
              PagesList.push(data);

              $scope.PagesList = PagesList;

              PageDetails.id = data.id;
              PageDetails.edition.id = data.id;

              $scope.loading = false;

              ToastService.show('The page was created successfully!');

              PageDetails.edition.syncSeo = "off";

              PageDetails.edition.preventSaving = false;
              PageDetails.edition.listenChanges = false;
              $state.go('pageEdit', { page: _config.rootFile,pageId: data.id });
            }, page);

            //Else if the id is present, so update the page
          }else{
            //edit page

              //pageQuery to execute on the current page querying
              var pageQuery = {
                id: PageDetails.id //Required by php webservice,
              };

              if ( !_config.touched ) {
                pageQuery.sp = 'pages/single'; //required for local environment
              }
              
              Pages.get(pageQuery, function(resource){

                //Override the instace of ngResource with new changes
                resource.title = PageDetails.edition.title;
                resource.body = PageDetails.edition.body;

                //NOTE: commented because we dont want seo data as json string
                resource.seo = JSON.stringify(PageDetails.edition.seo);

                //NOTE: add seo data as individual params
                // resource.seoTitle = PageDetails.edition.seo.title;
                // resource.seoDescription = PageDetails.edition.seo.description;
                // resource.seoKeywords = PageDetails.edition.seo.keywords;

                resource.SiteID = _config.SiteID||'';

                //Send the new updates to the server
                resource.$update(function(response){

                  //set the editor status to loading
                  $scope.loading = false;

                  //Update the UI
                  PageDetails.title = PageDetails.edition.title;
                  PageDetails.body = PageDetails.edition.body;
                  PageDetails.seo.title = PageDetails.edition.seo.title;
                  $scope.PageDetails = PageDetails;

                  //Update the page list information, so the current page info will be updated in the list
                  $scope.updatePageList();

                  //Show a small toast confirming the updates
                  ToastService.show('The page was updated successfully!');

                  PageDetails.edition.preventSaving = false;
                  PageDetails.edition.listenChanges = true;

                  //Redirect to the same page url
                  $state.go('pageEdit', { page: _config.rootFile, pageId: PageDetails.id });
                });
                
              });


          }

        };


        //Bing the searchbar visibility
        $scope.searchVisible = true;

        //Toggle the searchbar visibility
        $scope.toggleSearchbar = function(){
          $scope.searchVisible = !$scope.searchVisible;
        };

        //set up text editor
        $scope.editorOptions = {
          inline: false, //Disable inlline mode
          plugins : 'advlist autolink link image lists autoresize mention contextmenu code', //Plugins to load
          mentions: { //This is the setup for the auto-complete plugin
            source: [ //This array is the list of the tags available in the results, if want to use webservice see documenation for more.
              { name: 'Company Phone', tag: '{% CompanyPhone %}' },
              { name: 'Company Email', tag: '{% CompanyEmail %}' },
              { name: 'Path', tag: '{% path %}'},
              { name: 'Link', tag: '{%link%}'},
              { name: 'Secure', tag: '{%secure%}'},
              { name: 'Unsecure', tag: '{%unsecure%}'},
              { name: 'Company Url', tag: '{%CompanyURL%}'},
              { name: 'Company Name', tag: '{% CompanyName %}' },
              { name: 'Company Photo', tag: '{%CompanyLogo%}'},
              { name: 'Company Address', tag: ' {%CompanyAddress%}'},
              { name: 'Company City', tag: '{%CompanyCity%}'},
              { name: 'Company State', tag: '{%CompanyState%}'},
              { name: 'Company Zip', tag: '{%CompanyZip%}'},
              { name: 'Company Phone', tag: '{%CompanyPhone%}'},
              { name: 'Company Cell Phone', tag: '{%CompanyCellPhone%}'},
              { name: 'Consultant fullName', tag: '{%LOFullname%}'},
              { name: 'Consultant Title', tag: '{%LOTitle%}'},
              { name: 'Consultant Fax', tag: '{%LOFax%}'},
              { name: 'Consultant CellPhone', tag: '{%LOCell%}'},
              { name: 'Consultant Email', tag: '{%LOEmail%}'},
              { name: 'Consultant Phone', tag: '{%LOPhone%}'},
              { name: 'Consultant Address', tag: '{%LOAddress%}'},
              { name: 'Consultant NMLS', tag: '{%LONMLS%}'},
              { name: 'Consultant Role', tag: '{%LORole%}'},
              { name: 'Consultant Biography', tag: '{%LOBiography %}'},
              { name: 'Consultant FaceBook', tag: '{%LOFacebook%}'},
              { name: 'Consultant Twitter', tag: '{%LOTwitter%}'},
              { name: 'Consultant Linkedin', tag: '{%LOLinkedin%}'},
              { name: 'Consultant PersonalWebSite', tag: '{%LOPersonalWebSite%}'},
              { name: 'Consultant LoanApplicationURL', tag: '{%LOLoanApplicationURL%}'},
              { name: 'Consultant Username', tag: '{%LOusername%}'},
              { name: 'Consultant Branch Name', tag: '{%LOBranchName%}'},
              { name: 'Consultant Branch City', tag: '{%LOBranchCity%}'},
              { name: 'Consultant Branch State', tag: '{%LOBranchState%}'},
              { name: 'Consultant Branch Zip', tag: '{%LOBranchZip%}'},
              { name: 'Consultant Branch Phone', tag: '{%LOBranchPhone%}'},
              { name: 'Consultant Branch Fax', tag: '{%LOBranchFax%}'},
              { name: 'Consultant Branch NMLS', tag: '{%LOBranchNMLS%}'},
              { name: 'Consultant Branch CellPhone', tag: '{%LOBranchCell%}'},
              { name: 'Consultant Branch WebSite', tag: '{%LOBranchWebSite%}'},
              { name: 'Consultant Branch Description', tag: '{%LOBranchDescription%}'},
              { name: 'Consultant Branch Address', tag: '{%LOBranchAddress%}'},
              { name: 'Word "Us" changing for "Me"', tag: '{%Us%}'},
              { name: 'Address', tag: '{%FullAddress%}'},
              { name: 'Company ID', tag: '{%CompanyID%}'},
              { name: 'Company Email Notification', tag: '{%notificationEmail%}'},
              { name: 'Header Menu', tag: '{%menuHeader%}'},
              { name: 'Footer Menu', tag: '{%menuFooter%}'},
              { name: 'Sidebar Menu', tag: '{%menuSidebar%}'},
              { name: 'Secondary Menu', tag: '{%menuOther%}'},
              { name: 'Company ID', tag: '{%CompanyID%}'},
              { name: 'Company Email Notification', tag: '{%notificationEmail%}'},
              { name: 'Consultant SiteID', tag: '{%LOSiteID%}'},
              { name: 'Consultant ID', tag: '{%LOConsultantID%}'},
              { name: 'Consultant Testimonial', tag: '{%LOTestimonials%}'},
              { name: 'Consultant NMLSprefix', tag: '{%LONMLSprefix%}'},
              { name: 'Consultant Order', tag: '{%LOOrder%}'},
              { name: 'Consultant Branch ID', tag: '{%LOBranchBranchID%}'},
              { name: 'Consultant Branch SiteID', tag: '{%LOBranchBranchSiteID%}'},
              { name: 'Consultant Branch Email', tag: '{%LOBranchEmail%}'},
              { name: 'Consultant Branch SortOrder', tag: '{%LOBranchOrder%}'},
              { name: 'Consultant Branch LoanApplicationURL', tag: '{%LOBranchLoanApplicationURL%}'},
              { name: 'Consultant Branch UserName', tag: '{%LOBranchUserName%}'},
              { name: 'Consultant Branch Biography', tag: '{%LOBranchBiography%}'},
              { name: 'Consultant Branch SiteName', tag: '{%LOBranchSiteName%}'},
              { name: 'Content Title', tag: '{%CONTENT.TITLE|31|%}'},
              { name: 'Content Content', tag: '{%CONTENT.BODY|31|%}'},
              { name: 'Branch BranchID', tag: ' {%BranchID%}'},
              { name: 'Branch BranchSiteID', tag: '{%BranchSiteID%}'},
              { name: 'Branch Image', tag: '{%BranchPhoto%}'},
              { name: 'Branch Name', tag: '{%BranchName%}'},
              { name: 'Branch NMLS', tag: '{%BranchNMLS%}'},
              { name: 'Branch Email', tag: '{%BranchEmail%}'},
              { name: 'Branch WebSite', tag: '{%BranchWebSite%}'},
              { name: 'Branch SortOrder', tag: '{%BranchSortOrder%}'},
              { name: 'Branch City', tag: '{%BranchCity%}'},
              { name: 'Branch State', tag: '{%BranchState%}'},
              { name: 'Branch Zip', tag: '{%BranchZip%}'},
              { name: 'Branch Address', tag: '{%BranchAddress%}'},
              { name: 'Branch Phone', tag: '{%BranchPhone%}'},
              { name: 'Branch CellPhone', tag: '{%BranchCellPhone%}'},
              { name: 'Branch Fax', tag: '{%BranchFax%}'},
              { name: 'Branch LoanApplicationURL', tag: '{%BranchLoanApplicationURL%}'},
              { name: 'Branch UserName', tag: '{%BranchUserName%}'},
              { name: 'Branch Description', tag: '{%BranchDescription%}'},
              { name: 'Branch Biography', tag: '{%BranchBiography%}'},
              { name: 'Branch SiteName', tag: '{%BranchSiteName%}'}
            ],

            //NOTE: this source is to load the tags via ajax from the provided webservice
            // source: function (query, process, delimiter) {
            //     // Do your ajax call
            //     // When using multiple delimiters you can alter the query depending on the delimiter used
            //     if (delimiter === '@') {
            //        $.getJSON('ajax/users.json', function (data) {
            //           //call process to show the result
            //           process(data)
            //        });
            //     }
            // },

            render: function(item) { //how to render every result
              return '<li>' +
                       '<a href="javascript:;"><span>' + item.name + '</span></a>' +
                     '</li>';
            },
            insert: function(item) { //How the result will be inserted in the editor when is selected/clicked
              return '<span class="crm-customtag" alt="' + item.name + '">' + item.tag + '</span>';
            }
          },
          statusbar: false, //hide the statusbar
          toolbar: 'insertfile styleselect | bold italic | alignleft aligncenter alignright alignjustify | ' +
                    'bullist numlist | link image | crmtags | code', // Setup the toolbar buttons
          menubar: false, //hide the menubar
          setup: function(editor) { //Add some extra settings
            editor.on('change', function(e) {
              //for now do nothing

              function performResize() {
                var workflowHeight = angular.element('workflow').find('form').outerHeight();
                var excludeHeight = angular.element('.js-sidebar-exclusion-for-resize').outerHeight() + 1;
                var minheight = 700;
                var newHeight = minheight;

                if ( workflowHeight >= minheight ) {
                  newHeight = workflowHeight;
                }

                newHeight = newHeight - excludeHeight;

                angular.element('.pages-list').css({ maxHeight: newHeight });
              }

              if ( window._workflowResizeTimer !== undefined && window._workflowResizeTimer !== null ) {
                clearTimeout(window._workflowResizeTimer);
              }

              window._workflowResizeTimer = setTimeout(performResize, 100);
              performResize();
            });
          },
          autoresize_bottom_margin: 10,
          autoresize_max_height: 2000,
          autoresize_min_height: 250
        };

        //Allow the PageDetails be available in the editor context
        $scope.PageDetails = PageDetails;

        //Allow the PagesList be available in the editor context
        $scope.PagesList = PagesList;

        //Load the pages resource from the webservice
        Pages.query().$promise.then(function (response) {
            PagesList = response;
            $scope.loading = false;

            angular.element('content-editor').removeClass('em-is-loading');

            $scope.PagesList = PagesList;
        });


        });


        //fallback for stopPropagation (does nothing but skips error messages)
        Event.prototype.isPropagationStopped = function () {
          return true;
        };

})();
