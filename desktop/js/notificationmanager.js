
/* This file is part of Jeedom.
 *
 * Jeedom is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Jeedom is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Jeedom. If not, see <http://www.gnu.org/licenses/>.
 */

 $("#div_notifiers").sortable({axis: "y", cursor: "move", items: ".notifierCmd", placeholder: "ui-state-highlight", tolerance: "intersect", forcePlaceholderSize: true});

 $('#bt_addNotifier').on('click', function () {
    bootbox.prompt("{{Nom de la commande de notification ?}}", function (result) {
        if (result !== null && result != '') {
            addNotifier({name: result});
        }
    });
});

 $("#div_notifiers").delegate('.bt_addNotifierCmd', 'click', function () {
    var el = $(this);
    addNotifierCmd(el.closest('.notifier'), {});
});

 $('body').delegate('.rename', 'click', function () {
    var el = $(this);
    bootbox.prompt("{{Nouveau nom ?}}", function (result) {
        if (result !== null && result != '') {
            var previousName = el.text();
            el.text(result);
            el.closest('.panel.panel-default').find('span.name').text(result);
        }
    });
});

 $("#div_notifiers").delegate('.bt_removeNotifier', 'click', function () {
    $(this).closest('.notifier').remove();
});

 $("#div_notifiers").delegate('.bt_removeNotifierCmd', 'click', function () {
    $(this).closest('.notifierCmd').remove();
});

 $("body").delegate(".listCmdMessage", 'click', function () {
    var el = $(this).closest('.notifier').find('.notifierCmdAttr[data-l1key=cmd]');
    jeedom.cmd.getSelectModal({cmd: {type: 'action',subType : 'message'}}, function (result) {
        el.atCaret('insert',result.human);
    });
});


 function addCmdToTable(_cmd) {

 }

 function saveEqLogic(_eqLogic) {
    if (!isset(_eqLogic.configuration)) {
        _eqLogic.configuration = {};
    }
    _eqLogic.configuration.notifiers = [];
    $('#div_notifiers .notifier').each(function () {
        var notifier = $(this).getValues('.notifierAttr')[0];
        notifier.cmd = $(this).find('.notifierCmd').getValues('.notifierCmdAttr');
        _eqLogic.configuration.notifiers.push(notifier);
    });
    return _eqLogic;
}


function printEqLogic(_eqLogic) {
    $('#div_notifiers').empty();
    if (isset(_eqLogic.configuration)) {
        if (isset(_eqLogic.configuration.notifiers)) {
            for (var i in _eqLogic.configuration.notifiers) {
                addNotifier(_eqLogic.configuration.notifiers[i]);
            }
        }
        
    }
}

function addNotifier(_notifier) {
 var div = '<div class="notifier well">';
 div += '<form class="form-horizontal" role="form">';
 div += '<div class="form-group">';
 div += '<label class="col-sm-1 control-label">{{Nom de la commande}}</label>';
 div += '<div class="col-sm-2">';
 div += '<span class="notifierAttr label label-info rename cursor" data-l1key="name" style="font-size : 1em;"></span>';
 div += '</div>';
 div += '<div class="col-sm-2 col-sm-offset-7">';
 div += '<i class="fa fa-minus-circle pull-right cursor bt_removeNotifier"></i>';
 div += '<a class="btn btn-default btn-sm bt_addNotifierCmd pull-right"><i class="fa fa-plus-circle"></i> {{Commande}}</a>';

 div += '</div>';
 div += '</div>';
 div += '<div class="div_notifierCmd">';
 div += '</div>';
 div += '</form>';
 div += '</div>';
 $('#div_notifiers').append(div);
 $('#div_notifiers .notifier:last').setValues(_notifier, '.notifierAttr');

 if (is_array(_notifier.cmd)) {
    for (var i in _notifier.cmd) {
        if (_notifier.cmd[i] != '') {
            addNotifierCmd($('#div_notifiers .notifier:last'),  _notifier.cmd[i]);
        }
    }
} else {
    if ($.trim(_notifier.cmd) != '') {
        addNotifierCmd($('#div_notifiers .notifier:last'),  _notifier.cmd);
    }
}
}

function addNotifierCmd(_el, _notifierCmd) {
    if (!isset(_notifierCmd)) {
        _notifierCmd = {};
    }
    var div = '<div class="notifierCmd">';
    div += '<div class="form-group">';
    div += '<label class="col-sm-1 control-label">{{Commande}}</label>';
    div += '<div class="col-sm-4 has-success">';
    div += '<div class="input-group">';
    div += '<span class="input-group-btn">';
    div += '<input type="checkbox" class="notifierCmdAttr" data-l1key="enable" checked />';
    div += '<a class="btn btn-default bt_removeNotifierCmd btn-sm"><i class="fa fa-minus-circle"></i></a>';
    div += '</span>';
    div += '<input class="notifierCmdAttr form-control input-sm" data-l1key="cmd" />';
    div += '<span class="input-group-btn">';
    div += '<a class="btn btn-sm listCmdMessage btn-success"><i class="fa fa-list-alt"></i></a>';
    div += '</span>';
    div += '</div>';
    div += '</div>';
    div += '</div>';
    _el.find('.div_notifierCmd').append(div);
    _el.find('.notifierCmd:last').setValues(_notifierCmd, '.notifierCmdAttr');
}
