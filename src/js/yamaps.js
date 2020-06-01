import { addingImpressionToPoint } from './addingImpressionToPoint';
import { openBaloonOfChoosenPlacemark } from './openBaloonOfChoosenPlacemark';
import { getAddress } from './getAddress';
import { addPointsToMap } from './addPointsToMap';
import './styles.css';

function mapInit() {
    ymaps.ready(() => {
        var map = new ymaps.Map(
                'map',
                {
                    center: [59.94, 30.32],
                    zoom: 12,
                },
                {
                    searchControlProvider: 'yandex#search',
                }
            ),
            CustomItemContentLayout = ymaps.templateLayoutFactory.createClass(
                [
                    '<div  id = "placemark_{{properties.id}}">',
                    '<div class="header_inside_balloon">{{properties.name|raw }}</div>',
                    '<ul class = "parent_ul_in_common">',
                    '{% for item in properties.impressions %}',
                    '<li  class = "list_child_common_balloon">{{ item.place|raw }}</li>',

                    '<ul>',
                    '{% for item1 in item.impressions %}',
                    '<li>{{ item1.impression|raw }}</li>',
                    '{% endfor %}',
                    '</ul>',
                    '{% endfor %}',
                    '</ul>',
                    '<a href=# >Написать свой отзыв ...</a>',
                    '</div>',
                ].join(''),
                {
                    build: function (d) {
                        BalloonContentLayout.superclass.build.call(this);
                        document
                            .querySelectorAll('[id^="placemark_"]')[0]
                            .addEventListener('click', this.onLinkClick);
                    },

                    clear: function () {
                        document
                            .querySelectorAll('[id^="placemark_"]')[0]
                            .removeEventListener('click', this.onLinkClick);
                        BalloonContentLayout.superclass.clear.call(this);
                    },

                    onLinkClick: function (e) {
                        let idOfPlacemark = e.target.parentNode
                            .getAttribute('id')
                            .replace('placemark_', '');
                        openBaloonOfChoosenPlacemark(
                            idOfPlacemark,
                            map,
                            clusterer
                        );
                    },
                }
            ),
            clusterer = new ymaps.Clusterer({
                preset: 'islands#invertedBlueClusterIcons',
                clusterBalloonContentLayout: 'cluster#balloonCarousel',
                clusterBalloonItemContentLayout: CustomItemContentLayout,
                groupByCoordinates: false,
                clusterDisableClickZoom: true,
                clusterHideIconOnBalloonOpen: false,
                geoObjectHideIconOnBalloonOpen: false,
            }),
            username = '',
            place = '',
            impressionText = '',
            text = {},
            BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
                [
                    '<div class="balloon_box">',
                    '<div class="header_inside_balloon"><i class="fas fa-map-marker-alt my_icon"></i>{{properties.name}}</div>',
                    '<div class="reviews">',
                    '<ul id="list_parent">',
                    '{% for item in properties.impressions %}',
                    '<li>{{ item.place|raw }}',

                    '<ul class="list_child">',
                    '{% for item1 in item.impressions %}',
                    '<li>{{ item1.impression|raw }}',
                    ' <span class = "span_for_username" >({{ item1.username|raw }})</span></li>',
                    '{% endfor %}',
                    '</ul>',

                    '</li>',
                    '{% endfor %}',
                    '</ul>',
                    '</div>',
                    '<div>',
                    '<div class="my_h4">ВАШ ОТЗЫВ</div>',
                    '<div>',
                    '<form class="form_class"  id="form">',
                    '<input type="text" class="inputField" placeholder="Ваше имя" name="username"><br />',
                    '<input type="text"  class="inputField" placeholder="Укажите место" name="place"><br />',
                    '<textarea name="impression" placeholder="Поделитесь впечатлениями" cols="40" rows="4" class="inputField"></textarea>',
                    '<input class="send_button" type="button" value="Отправить" id = "submitButton" idofplacemark={{properties.id}} disabled>',
                    '</form>',
                    '</div>',
                    '</div>',
                ].join(''),
                {
                    build: function (id) {
                        BalloonContentLayout.superclass.build.call(this);
                        form.addEventListener('keyup', this.onKeyUp);
                        submitButton.addEventListener(
                            'click',
                            this.onSubmitClick
                        );

                        if (
                            list_parent.getElementsByTagName('li').length == 0
                        ) {
                            text = document.createTextNode('Отзывов пока нет');
                            document
                                .getElementsByClassName('reviews')[0]
                                .appendChild(text);
                        }
                    },

                    clear: function () {
                        submitButton.removeEventListener(
                            'click',
                            this.onSubmitClick
                        );
                        BalloonContentLayout.superclass.clear.call(this);
                    },

                    onSubmitClick: function () {
                        username = form.elements.username.value;
                        place = form.elements.place.value;
                        impressionText = form.elements.impression.value;
                        const id = submitButton.getAttribute('idofplacemark');
                        addingImpressionToPoint(
                            id,
                            username,
                            place,
                            impressionText,
                            map,
                            clusterer
                        );

                        let currentNode = null;
                        for (let item of list_parent.childNodes) {
                            if (item.firstChild.nodeValue == place) {
                                currentNode = item;
                            }
                        }

                        if (
                            list_parent.childNodes.length > 0 &&
                            currentNode != null
                        ) {
                            for (let item of list_parent.childNodes) {
                                if (item.firstChild.nodeValue == place) {
                                    const liNew = document.createElement('li');
                                    const nodeForLiNew = document.createTextNode(
                                        `${impressionText} `
                                    );
                                    const usernameNode = document.createElement(
                                        'span'
                                    );
                                    usernameNode.classList.add(
                                        'span_for_username'
                                    );
                                    const usernameNodeText = document.createTextNode(
                                        `(${username})`
                                    );
                                    usernameNode.appendChild(usernameNodeText);
                                    liNew.appendChild(nodeForLiNew);
                                    liNew.appendChild(usernameNode);
                                    item.querySelector(
                                        '.list_child'
                                    ).appendChild(liNew);
                                }
                            }
                        } else {
                            const liNewParent = document.createElement('li');
                            const nodeForLiNewParent = document.createTextNode(
                                `${place}`
                            );
                            liNewParent.appendChild(nodeForLiNewParent);

                            const liNew = document.createElement('li');
                            const nodeForLiNew = document.createTextNode(
                                `${impressionText} `
                            );
                            const usernameNode = document.createElement('span');
                            usernameNode.classList.add('span_for_username');
                            const usernameNodeText = document.createTextNode(
                                `(${username})`
                            );
                            usernameNode.appendChild(usernameNodeText);
                            liNew.appendChild(nodeForLiNew);
                            liNew.appendChild(usernameNode);

                            const ulNew = document.createElement('ul');
                            ulNew.setAttribute('class', 'list_child');
                            ulNew.appendChild(liNew);
                            liNewParent.appendChild(ulNew);

                            list_parent.appendChild(liNewParent);
                        }
                        if (
                            document.getElementsByClassName('reviews')[0]
                                .lastChild == text
                        )
                            document
                                .getElementsByClassName('reviews')[0]
                                .removeChild(text);
                    },

                    onKeyUp: function () {
                        if (
                            form.querySelector('input[name=place]').value
                                .length > 0 &&
                            form.querySelector('input[name=username]').value
                                .length > 0 &&
                            form.querySelector('textarea[name=impression]')
                                .value.length > 0
                        ) {
                            submitButton.disabled = false;
                        } else submitButton.disabled = true;
                    },
                }
            );

        map.geoObjects.add(clusterer);
        addPointsToMap(clusterer, BalloonContentLayout);

        map.events.add('click', async function (e) {
            const coords = e.get('coords');

            const adr = await getAddress(coords);

            let placeMark = await new ymaps.Placemark(
                coords,
                {
                    name: adr,
                    impressions: [],
                    id: coords[0],
                },
                {
                    balloonContentLayout: BalloonContentLayout,
                    balloonPanelMaxMapArea: 0,
                }
            );

            const id = placeMark.properties.get('id');

            if (typeof coords[0] == 'number' && typeof coords[1] == 'number') {
                //map.geoObjects.add(placeMark);
                clusterer.add(placeMark);
                let geoObjectState = clusterer.getObjectState(placeMark);
                if (geoObjectState.isShown) {
                    if (!geoObjectState.isClustered) {
                        placeMark.balloon.open();
                    } else {
                        clusterer.remove(placeMark);
                    }
                }
            }
        });

        map.geoObjects.events.add('balloonclose', function (e) {
            let pointtyperet = e.get('target');
            if (
                pointtyperet.properties != null &&
                pointtyperet.properties.get('impressions') != null &&
                pointtyperet.properties.get('impressions').length == 0
            ) {
                clusterer.remove(pointtyperet);
                return;
            }

            if (pointtyperet.geometry != undefined) {
                const placemarksArray = clusterer.getGeoObjects();

                const including = placemarksArray.indexOf(pointtyperet);

                if (including == -1) {
                    clusterer.add(pointtyperet);
                }
            }
        });
    });
}

export { mapInit };
