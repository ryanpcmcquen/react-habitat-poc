////This plugin requires postMessage.js
//(function($) {
//    try {
//        //Define the plugin's name here
//        var __name = 'loginPopupAjax';
//        //--
//        $.fn[__name] = function(options) {
//            //-- Plugin gymnastics - Part 1/3
//            //-- ------------------------------------------------------
//            var self = this; // prevent from loosing the scope
//            self.view = $(this);
//            self.view.data(__name, self); // store the plugin instance into the element
//            self.el = $(self.selector);
//            //-- ------------------------------------------------------
//
//            //-- init
//            //-- ------------------------------------------------------
//            self.defaults = {};
//
//            self.initialize = function() {
//
//                console.log('initialize');
//                // merging defaults with passed arguments
//                self.options = $.extend({}, self.defaults, options);
//                //-
//
//                //loginPopupAjax.init(); ------------------------- UNCOMMENT THIS IN ORDER TO USE ----------------------
//                return self;
//            };
//
//            //-- Vars
//            //-- ------------------------------------------------------
//            var loginSuccessUrl = (options != null && typeof options.successUrl != 'undefined') ? options.successUrl : null;
//            var previousPage = (options != null && typeof options.previousPage != 'undefined') ? options.previousPage : null;
//            var loginForm;
//            var registrationForm;
//            var loginFormOptions;
//            var registerFormOptions;
//            var isAjax = (options != null && typeof options.isAjax != 'undefined') ? options.isAjax : false;
//
//            var dig = function(sbj) {
//                return self.view.find(sbj);
//            };
//
//
//            //-- Start
//            //-- ------------------------------------------------------
//            var loginPopupAjax = window.plugin_loginPopupAjax = {
//
//                init: function() {
//
//                    //- Kill object first
//                    self.view[__name] = null;
//                    this.bindEvents();
//                },
//
//                bindEvents: function() {
//
//                    console.log('bindEvents');
//                    var me = this;
//
//                    $(document).ready(function() {
//
//                        console.log('DOM ready');
//                        console.log('log-previousPage:' + previousPage);
//                        console.log('log-loginSuccessUrl:' + loginSuccessUrl);
//                        //previousPage = $("input[data-previousUrl]").attr('data-previousUrl');
//                        //loginSuccessUrl = $("input[data-successUrl]").attr('data-successUrl');
//                        loginForm = $('#popupLoginForm');
//                        registrationForm = $('#popupRegisterForm');
//
//                        me.formHandler();
//                    });
//
//                },
//
//                formHandler: function() {
//
//                    var me = this;
//
//                    var loginOptions = {
//                        modalId: '#loginPopup',
//                        previousPage: previousPage,
//                        beforeSerialize: function($form, options) {
//                            /*
//                             * Change the success url so that we just get a simple success page instead of the account home.
//                             * Depending on the response we will either refresh the parent page or redirect to a new page.
//                             */
//
//                            console.log('log-formHandler');
//                            console.log('log-loginSuccessUrl:' + loginSuccessUrl);
//
//                            var successUrl = loginSuccessUrl;
//                            $('#loginSuccessURL', $form).val(successUrl + '?type=login');
//                            $('#createSuccessURL', $form).val(successUrl + '?type=register');
//                            $('#changeTempPasswordSuccessURL', $form).val(successUrl + '?type=login');
//
//                        },
//                        success: function loginSuccess(responseText, statusText, xhr, $form) {
//                            console.log('log-success');
//                            if (isAjax) {
//                                console.log('log-success-ajax');
//                                me.successAjax(responseText, statusText, xhr, $form);
//                            } else {
//                                console.log('log-success-noajax');
//                                me.successNonAjax(responseText, statusText, xhr, $form);
//                            }
//                        },
//                        error: function loginError(xhr, statusText, exception) {
//                            if (isAjax) {
//                                me.errorAjax(xhr, statusText, exception);
//                            } else {
//                                me.errorNonAjax(xhr, statusText, exception);
//                            }
//                        }
//                    };
//
//                    loginFormOptions = $.extend({}, loginOptions, { formId: '#popupLoginForm' });
//                    loginForm.ajaxForm(loginFormOptions);
//
//console.log('log-loginFormOptions' + typeof loginFormOptions);
//console.log('log-loginFormOptions:' + loginFormOptions);
//
//                    registerFormOptions = $.extend({}, loginOptions, { formId: '#popupRegisterForm' });
//                    registrationForm.ajaxForm(registerFormOptions);
//
//console.log('log-additionastetps');
//                    if (isAjax) {
//                        me.additionalStepsAjax();
//                    } else {
//                        me.additionalStepsNonAjax();
//                    }
//
//                }, //closes the formHandler
//
//                successNonAjax: function(responseText, statusText, xhr, $form) {
//
//                    console.log('log-successNonAjax');
//                    console.log('log-this.previousPage:' + this.previousPage);
//                    console.log('log-formId:' + formId);
//                    console.log('log-this.modalId:' + this.modalId);
//
//                    var formId = '#' + $form.attr('id'),
//                        pmData = { formId: formId, modalId: this.modalId, previousPage: this.previousPage },
//                        responseObj = {},
//                        content = "",
//                        $response = $($.trim(responseText));
//                    if (statusText == 'success') {
//
//                        if ($response.attr('id') == 'updatedHeader') {
//
//                            console.log('log-updatedHeader');
//
//                            // successful login. update header content.
//                            content = $response.find('#topHeader').html();
//                            responseObj = { 'content': content };
//                            pmData = $.extend(pmData, responseObj);
//                            pm({
//                                target: window.parent,
//                                type: 'loginFormSuccess',
//                                data: pmData
//                            });
//
//                            var grFluid = this.getURLParameter("grFluid");
//                            console.log('log-grFluid:' + grFluid);
//                            $(window).trigger("loggedin", { modalId: this.modalId, grFluid: grFluid });
//
//
//                        } else if ($response.find('#resetpasswd').length > 0) {
//                            // enforce password change was triggered
//                            content = $response.find('#resetpasswd')[0].outerHTML;
//                            responseObj = { 'content': content };
//                            pmData = $.extend(pmData, responseObj);
//
//                            //add the form to the page so that we can submit it
//                            $('#xyz').empty().html($response.find('#xyz').html());
//
//                            pm({
//                                target: window.parent,
//                                type: 'loginEnforcePasswordChange',
//                                data: pmData
//                            });
//                        } else if ($response.find('#' + formId).length > 0) {
//                            //When there are errors, the html form will return
//                            content = $response.find('#' + formId).html();
//                            responseObj = { 'content': content };
//                            pmData = $.extend(pmData, responseObj);
//                            pm({
//                                target: window.parent,
//                                type: 'loginFormError',
//                                data: pmData
//                            });
//
//                        } else {
//                            // we got back some other html page, perhaps session expired
//                            proxyFunctions.sendErrorContent(this.modalId, this.formId);
//                        }
//                    } else {
//                        // bad response.
//                        console.log('statusText: ' + statusText);
//                        proxyFunctions.sendErrorContent(this.modalId, this.formId);
//                    }
//                }, //closes successNonAjax
//
//                errorNonAjax: function(xhr, statusText, exception) {
//                    console.log('Request Failed: ' + statusText + ' exception: ' + exception);
//                    proxyFunctions.sendErrorContent(this.modalId, this.formId);
//                }, //closes errorNonAjax
//
//                additionalStepsNonAjax: function() {
//
//                    console.log('log-additionalStepsNonAjax');
//                    console.log('log-PF' + typeof proxyFunctions);
//
//                    /*post Message listeners */
//                    pm.bind("postForm", function(data) {
//                        proxyFunctions.handlePostForm(data);
//                    });
//                }, //closes additionalStepsNonAjax
//
//                successAjax: function(responseText, statusText, xhr, $form) {
//
//                    console.log('log-successAjax');
//
//                    var formId = '#' + $form.attr('id'),
//                        content = "",
//                        $response = $($.trim(responseText));
//                    if (statusText == 'success') {
//
//                        if ($response.attr('id') == 'updatedHeader') {
//
//                            console.log('log-updatedHeader');
//                            var grFluid = this.getURLParameter("grFluid");
//                            console.log('log-grFluid' + grFluid);
//                            $(window).trigger("loggedin", { modalId: this.modalId, grFluid: grFluid });
//                            console.log('log-previousPage' + this.previousPage);
//                            if (this.previousPage == "") {
//                                // successful login, update the header
//                                content = $response.find('#topHeader').html();
//                                loginModalFunctions.updateLoginStatus(this.modalId, content);
//                            } else {
//                                loginModalFunctions.redirectOnSucess(this.previousPage);
//                            }
//                        } else if ($response.find('#resetpasswd').length > 0) {
//                            // enforce password change was triggered
//                            content = $response.find('#xyz').html();
//                            loginModalFunctions.loginEnforcePasswordChange(content);
//                        } else if ($response.find('#' + formId).length > 0) {
//                            //When there are errors, the form will return
//                            content = $response.find('#' + formId).html();
//                            loginModalFunctions.showFieldErrors($form, content);
//                        } else {
//                            // we got an unexpected response (perhaps caused by session timeout)
//                            loginModalFunctions.showFormError($form);
//                        }
//
//                    } else {
//                        // bad response.
//                        console.log('statusText: ' + statusText);
//                        loginModalFunctions.showFormError($form);
//                    }
//                }, //closes successAjax
//
//                errorAjax: function(xhr, statusText, exception) {
//                    console.log('Request Failed: ' + statusText + ' exception: ' + exception);
//                    proxyFunctions.sendErrorContent(this.modalId, this.formId);
//                }, //closes errorAjax
//
//                additionalStepsAjax: function() {
//                    // bind the click event to the form. Because we will replace the form contents with our ajax response we want to
//                    // listen for the click (event bubbling) on an element that won't change.
//                    $loginForm.bind("click", function(e) {
//                        // because the submit buttons are actually spans wrapped in an a tag, we need to look at the id of the parent
//                        var targetId = e.target.parentNode.id;
//                        if (targetId == "loginBtnId") {
//                            //hide the button and show a loading progress animation
//                            $("#loginBtnId").hide().parent().find('.waitingBtn').show();
//                            $('#popupLoginForm').submit();
//                        }
//                        e.preventDefault();
//                    });
//
//                    // same as above for registration form
//                    $registrationForm.bind("click", function(e) {
//                        var targetId = e.target.parentNode.id;
//                        if (targetId == "registerSubBtn") {
//                            //hide the button and show a loading progress animation
//                            $("#registerSubBtn").hide().parent().find('.waitingBtn').show();
//                            $('#popupRegisterForm').submit();
//                        }
//                        e.preventDefault();
//                    });
//                    createPopupGIF("#loginPopup", false);
//                }, //closes additionalStepsAjax
//
//                getURLParameter: function(sParam) {
//                        var sPageURL = window.location.search.substring(1);
//                        var sURLVariables = sPageURL.split('&');
//                        for (var i = 0; i < sURLVariables.length; i++) {
//                            var sParameterName = sURLVariables[i].split('=');
//                            if (sParameterName[0] == sParam) {
//                                return sParameterName[1];
//                            }
//                        }
//                    } //closes getURLParameter
//
//            }; // closes the class
//
//            //-
//            return self.initialize();
//        }
//    } catch (e) {
//        base.fn.err(e);
//    }
//})(jQuery);
//
