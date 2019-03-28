# Dokumentation Modul 300 LB01

Make new branch from commit faa5e08e4491246865fb9aa85955ea7abcc5b7a0 (where the db still works and then first add reverse proxy and then firewall and finally some small mysql changes)

## Inhaltsverzeichnis

-   01 - Einstieg
-   02 - Vagrant Umsetzung
-   03 - Sicherheitsaspekte
-   04 - Abschluss

---

## 01 Einstieg

### Persönlicher Wissensstand

| Technologie        | Beschreibung                                                                                                                                                                                                                                                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Docker / Container | Ich konnte bereits Erfahrungen mit Docker sammeln. Bei der Arbeit habe ich eine PHP-Applikation in einem Docker-Container entwickelt und dann auch so deployed. Zudem konnte ich bereits einige Erfahrungen mit KVM-Containern sammeln.                                                                                              |
| Microservices      | Microservies kenne ich lediglich aus der Theorie. Ich weiss, dass damit kleine, kompakte Applikationen in einem Container gemeint sind. Zudem kann man dann tools wie Kubernetes verwenden, um viele dieser kleinen Container zu managen. Allerdings konnte ich bisher noch keine Praxiserfahrungen mit diesen Technologien sammeln. |

### Kennt die Vagrant-Befehlte

| Befehl       | Beschreibung                                       |
| ------------ | -------------------------------------------------- |
| docker run   | Führt ein Befehl in einem neuen Container aus      |
| docker start | Startet einen oder mehrere gestoppte Container     |
| docker stop  | Stoppt einen oder mehrere laufende ontainer        |
| docker build | Erstellt ein Image aus einem Docker-File           |
| docker pull  | Ladet ein Image aus der Registry                   |
| docker push  | Ladet ein Image in die Registry hoch               |
| docker exec  | Führ einen Befehl in einem laufenden Container aus |

## 02 Vagrant Umsetzung

### Netzwerkplan

    +--------------------+          +--------------------+          +---------------------+
    ! Proxy Server       !          ! Web Server         !          ! Datenbank Server    !
    ! Host: proxy        !          ! Host: web          !          ! Host: db            !
    ! IP: 192.168.40.99  ! <------> ! IP: 192.168.40.100 ! <------> ! IP: 192.168.40.101  !
    ! Port: 5000         !          ! Port: 80           !          ! Port 3306           !
    ! Nat: 5000          !          ! Nat: -             !          ! Nat: -              !
    +--------------------+          +--------------------+          +---------------------+

## 03 Sicherheitsaspekte

### Firewall

Ausgehende Verbindungen werden standardmässig erlaubt.

#### Proxy

-   `sudo ufw enable`
-   `sudo ufw allow 5000`
-   `sudo ufw allow from 192.168.40.1 to any port 22`

#### Web

-   `sudo ufw enable`
-   `sudo ufw allow from 192.168.40.99 to any http`
-   `sudo ufw allow from 192.168.40.1 to any port 22`

#### DB

-   `sudo ufw enable`
-   `sudo ufw allow from 192.168.40.100 to any port 3306`
-   `sudo ufw allow from 192.168.40.1 to any port 22`

### Reverse Proxy

```
ProxyPass "/proxy" "http://192.168.40.100"
ProxyPassReverse "/proxy" "http://192.168.40.100"
```

### Benutzer

#### Proxy

| Benutzername | Funktion                                                                                                 |
| ------------ | -------------------------------------------------------------------------------------------------------- |
| `root`       | Der Systemverwalter unter Linux                                                                          |
| `nobody`     | Wird von Prozessen als Benutzererkennung verwendet, wenn nur ein Minimum an Rechten vergeben werden soll |
| `www-data`   | Benutzer des Webservers Apache                                                                           |

#### Web

| Benutzername | Funktion                                                                                                 |
| ------------ | -------------------------------------------------------------------------------------------------------- |
| `root`       | Der Systemverwalter unter Linux                                                                          |
| `nobody`     | Wird von Prozessen als Benutzererkennung verwendet, wenn nur ein Minimum an Rechten vergeben werden soll |
| `www-data`   | Benutzer des Webservers Apache                                                                           |

#### DB

| Benutzername | Funktion                                                                                                 |
| ------------ | -------------------------------------------------------------------------------------------------------- |
| `root`       | Der Systemverwalter unter Linux                                                                          |
| `nobody`     | Wird von Prozessen als Benutzererkennung verwendet, wenn nur ein Minimum an Rechten vergeben werden soll |
| `mysql`      | Benutzer der MySQL Datenbank                                                                             |

### SSH-Zugriff

Auf eine VM wird mit folgendem Befehl per SSH zugegriffen: `vagrant ssh proxy`, `vagrant ssh web`, `vagrant ssh db`

## 04 Abschluss

### Testfälle

| Testfall                                                                                              | Resultat                                                                                                                                |
| ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Vom Client (192.168.40.1) auf http://localhost:5000 zugreifen                                         | Funktioniert. Die Default Page des Proxy Servers (192.168.40.99) wird angezeigt                                                         |
| Vom Client (192.168.40.1) auf http://localhost:5000/proxy                                             | Funktioniert. Die PHP-Seite mti den Datenbank-Daten des Webservers (192.168.40.100) wird angezeigt                                      |
| Vom Client (192.168.40.1) auf http://192.168.40.100 zugreifen                                         | Man erhält keine Antwort, da die Firewall nur Verbindungen vom dem Proxy zulässt                                                        |
| Vom Client (192.168.40.1) auf die Datenbank (192.168.40.101) zugreifen mit dem Benutzeraccount `root` | Funktioniert nicht, da die Firewall den Zugriff blockiert und der Benutzer in SQL zusätzlich auch nur für 192.168.40.100 zugelassen ist |
| Vom Client (192.168.40.1) auf die Datenbank (192.168.40.101) zugreifen mit dem Benutzeraccount `root` | Funktioniert nicht, da die Firewall den Zugriff blockiert und der Benutzer in SQL zusätzlich auch nur für 192.168.40.100 zugelassen ist |
| Vom Client (192.168.40.1) auf den Webserver (192.168.40.100) zugreifen per SSH                        | Funktioniert, da eine SSH Verbindung vom Client her zugelassen wurde in der Firewall                                                    |
| Vom Proxy (192.168.40.99) auf den Webserver (192.168.40.100) zugreifen per SSH                        | Funktioniert nicht, da diese SSH Verbindung in der Firewall nicht zugelassen wurde                                                      |

### Vergleich Vorwissen / Wissenszuwachs

Hauptsächlich konnte ich während dieses Projektes meine Shell-Scripting Fähigkeiten verbessern. Die Vagrant-Grundlagen habe ich bereits gekannt, konnte hier aber erstmals mit einem Multi-VM-System arbeiten. Allerdings habe ich zuvor noch nie Shell-Scripts für die automatisierte Installation von Diensten erstellt, was sehr lehrreich war.

### Reflextion

Dieses Projekt lief meiner Meinung nach sehr gut. Ich kam schnell voran und konnte bis zum Ende des Projektes mein Projekt gut abschliessen, sodass ich mit dem Endresultat zufrieden war. Während der Realisierung wurde ich zwischenzeitlich etwas davon überrascht, dass die automatisierte Installation mit Shell-Scripts nicht so einfach war, wie ich anfänglich gedacht habe. Der Rest des Projektes verlief jedoch zufriedenstellend.
