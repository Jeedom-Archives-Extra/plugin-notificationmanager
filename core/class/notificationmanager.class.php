<?php

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

/* * ***************************Includes********************************* */
require_once dirname(__FILE__) . '/../../../../core/php/core.inc.php';

class notificationmanager extends eqLogic {
	/*     * *************************Attributs****************************** */

	/*     * ***********************Methode static*************************** */

	/*     * *********************Méthodes d'instance************************* */

	public function postSave() {
		$existing_notifier = array();
		if (is_array($this->getConfiguration('notifiers'))) {
			foreach ($this->getConfiguration('notifiers') as $key => $value) {
				$existing_notifier[] = $value['name'];
				$cmd = null;
				foreach ($this->getCmd() as $cmd_list) {
					if ($cmd_list->getName() == $value['name']) {
						$cmd = $cmd_list;
						break;
					}
				}
				if ($cmd == null) {
					$cmd = new notificationmanagerCmd();
				}
				$cmd->setName($value['name']);
				$cmd->setEqLogic_id($this->getId());
				$cmd->setType('action');
				$cmd->setSubType('message');
				$cmd->setLogicalId('notifier');
				$cmd->save();
			}
		}
		foreach ($this->getCmd() as $cmd) {
			if ($cmd->getType() == 'action' && !in_array($cmd->getName(), $existing_notifier) && $cmd->getLogicalId() == 'notifier') {
				$cmd->remove();
			}
		}
	}

	/*     * **********************Getteur Setteur*************************** */
}

class notificationmanagerCmd extends cmd {
	/*     * *************************Attributs****************************** */

	/*     * ***********************Methode static*************************** */

	/*     * *********************Methode d'instance************************* */

	public function dontRemoveCmd() {
		return true;
	}

	public function execute($_options = array()) {
		if ($this->getType() == 'info') {
			return;
		}
		$eqLogic = $this->getEqLogic();
		$notifier = null;
		if (is_array($eqLogic->getConfiguration('notifiers'))) {
			foreach ($eqLogic->getConfiguration('notifiers') as $key => $value) {
				if ($this->getName() == $value['name']) {
					$notifier = $value;
				}
			}
		}
		foreach ($notifier['cmd'] as $cmd) {
			if ($cmd['enable'] != 1) {
				continue;
			}
			$ok = false;

			$cmds = explode('&&', $cmd['cmd']);
			foreach ($cmds as $cmd_id) {
				try {
					$cmd_find = cmd::byId(str_replace('#', '', $cmd_id));
					if (is_object($cmd_find)) {
						$cmd_find->execCmd($_options);
						$ok = true;
					}
				} catch (Exception $e) {

				}
			}

			if ($ok) {
				break;
			}
		}
	}

	/*     * **********************Getteur Setteur*************************** */
}

?>
